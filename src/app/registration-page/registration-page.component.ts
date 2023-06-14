import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { Subscription } from 'rxjs/Subscription'

import { environment } from '../../environments/environment'
import { AuthenticationService, TokenUserInfo } from '../authentication.service'
import { PaymentService } from '../payment.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'
import { User } from '../user'
import { UserService } from '../user.service'

@Component({
	selector: 'app-registration-page',
	styleUrls: ['./registration-page.component.scss'],
	templateUrl: './registration-page.component.html'
})
export class RegistrationPageComponent implements OnInit {
	user: User = {
		attendanceDates: {},
		emergencyContact: {},
		pronouns: '',
		shouldPrintPronouns: false,
		hasAcceptedCovidPolicy: false,
		isBringingMinors: false,
	} as User
	userTokenInfo: TokenUserInfo
	minDate: Date = new Date(2023, 6, 13)
	maxDate: Date = new Date(2023, 6, 24)
	handler: any
	paymentAmount: number
	speedrunEvent: SpeedrunEvent
	hasFullUserLoaded: boolean = false
	isFetching: boolean = false
	isProcessingPayment: boolean = false
	spinnerMessage: string = 'Fetching user details...'
	spinnerError: string
	hasAdminRole: boolean = false
	canBackdoor: boolean = false
	adminControlsEnabled: boolean = false

	@ViewChild('f') form: any

	constructor(
		private auth: AuthenticationService,
		private speedrunEventService: SpeedrunEventService,
		private paymentService: PaymentService,
		private userService: UserService,
		private snackBar: MatSnackBar
	) {
		this.userTokenInfo = this.auth.getUserInfo()
		this.hasAdminRole = this.userTokenInfo && this.userTokenInfo.roles && this.userTokenInfo.roles.includes('admin')
		this.canBackdoor = this.userTokenInfo && this.userTokenInfo.roles &&
			this.userTokenInfo.roles.includes('override-registration')
		this.auth.profile().subscribe((user: User) => {
			this.user = user
			if (!this.user.attendanceDates) {
				this.user.attendanceDates = {
					startDate: null,
					endDate: null
				}
			}
			if (!this.user.emergencyContact) {
				this.user.emergencyContact = {
					name: '',
					relationship: '',
					phone: ''
				}
			}
			// if (!this.user.hasAcceptedCovidPolicy) {
			// 	this.user.hasAcceptedCovidPolicy = false
			// }
			this.hasFullUserLoaded = true
		})
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
				this.paymentAmount = srEvent.registrationCost || 0

				if (this.userTokenInfo.roles.includes('skip-payment')) {
					this.paymentAmount = 0
				}
			})
	}

	ngOnInit() {
		this.handler = StripeCheckout.configure({
			image: 'https://rpglimitbreak.com/favicon.png',
			key: environment.stripeKey,
			locale: 'auto',
			token: (token: any) => {
				this.isProcessingPayment = true
				this.spinnerMessage = 'Processing payment...'

				this.paymentService.processPayment(token, this.paymentAmount)
					.subscribe(
						(res: any) => {
							this.spinnerMessage += ' Payment successful! Registering for event...'
							this.userService.registerUser()
								.subscribe(
									(regRes: any) => {
										this.user = regRes.data
										this.isProcessingPayment = false
									},
									(err: any) => {
										console.error('Registration error', err)
										this.spinnerError = 'Something went wrong. It looks like your payment was ' +
											'successful, but registration failed. Please contact an administrator ' +
											'and be ready to show proof of purchase. DO NOT retry registration unless ' +
											'instructed.'
									})
						},
						(err: any) => {
							this.spinnerError = 'It appears we were unable to charge your credit card. Please confirm ' +
								'that you have not been charged and try again. You may need to check your card balance. ' +
								'If this issue persists, please contact an administrator.'
							console.error('error', err)
						}
					)
			}
		})
	}

	onFormChange(target?: string) {
		// This is a hack to fix the requirement dependency of minorsNum and minorsNames.
		// This should be handled with a custom, conditional validator upon upgrading the site
		// to use FormControls.
		// See https://medium.com/ngx/3-ways-to-implement-conditional-validation-of-reactive-forms-c59ed6fc3325#6a2a
		if (target === 'minors' && !this.form.controls.minors.value) {
			setTimeout(() => this.onFormChange(), 100)
			return
		}

		if (this.form.valid) {
			this.userService.editUser(this.user)
				.subscribe(
					(res: any) => {
						this.snackBar.open('Information saved', '', {
							duration: 5000,
							panelClass: ['snack-success', 'no-action']
						})
					},
					(err: any) => {
						this.snackBar.open('Information failed to save', '', {
							duration: 5000,
							panelClass: ['snack-warn', 'no-action']
						})
					}
				)
		}
	}

	handlePayment(e: any) {
		// TODO: For some reason, when skipping payment via the next code block, the scroll snaps back to
		//       the top of the page. This `preventDefault()` call was to try to circumvent that, but it
		//       doesn't appear to work. Requires more investigation if issue still persists *after*
		//       migration to newer Stripe flow.
		e.preventDefault()
		this.isFetching = true

		// TODO: This code isn't DRY as it's used by the payment processing. Need to handle $0 payments
		//       better once Stripe Checkout is migrated to newer version.
		if (this.userTokenInfo.roles.includes('skip-payment')) {
			this.isProcessingPayment = true
			this.spinnerMessage = 'Processing payment... Payment successful! Registering for event...'
			this.userService.registerUser()
				.subscribe(
					(regRes: any) => {
						this.user = regRes.data
						this.isProcessingPayment = false
					},
					(err: any) => {
						console.error('Registration error', err)
						this.spinnerError = 'Something went wrong. It looks like your payment was ' +
							'successful, but registration failed. Please contact an administrator ' +
							'and be ready to show proof of purchase. DO NOT retry registration unless ' +
							'instructed.'
					})
			return
		}

		// Get latest info to see if registration is still open
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
				this.paymentAmount = srEvent.registrationCost || 0
				this.isFetching = false

				if (srEvent.registeredUsersCount >= srEvent.maxRegisteredUsers) {
					// Do something when cap is reached
				} else {
					this.handler.open({
						amount: this.paymentAmount * 100,
						description: 'Attendee fee',
						name: this.speedrunEvent.name,
					})
				}
			})
	}

	@HostListener('window:popstate')
		onPopstate() {
			this.handler.close()
		}

}
