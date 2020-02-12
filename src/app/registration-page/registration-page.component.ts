import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
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
		emergencyContact: {}
	} as User
	userTokenInfo: TokenUserInfo
	minDate: Date = new Date(2020, 4, 6)
	maxDate: Date = new Date(2020, 4, 20)
	handler: any
	paymentAmount: number
	srEvent: SpeedrunEvent
	hasFullUserLoaded: boolean = false
	isFetching: boolean = false
	isProcessingPayment: boolean = false
	spinnerMessage: string = 'Fetching user details...'
	spinnerError: string
	hasEventRole: boolean = false
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
		this.hasEventRole = this.userTokenInfo && this.userTokenInfo.roles &&
			(this.userTokenInfo.roles.includes('event') || this.userTokenInfo.roles.includes('admin'))
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
			this.hasFullUserLoaded = true
		})
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.srEvent = srEvent
				this.paymentAmount = srEvent.registrationCost || 0
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
											'and be ready to show proof of purchase. DO NOT retry registration unless' +
											'instructed.'
									})
						},
						(err: any) => {
							this.spinnerError = 'It appears we were unable to charge your credit card. Please confirm ' +
								'that you have not been charged and try again. You may need to check your card balance.' +
								'If this issue persists, please contact an administrator.'
							console.error('error', err)
						}
					)
			}
		})
	}

	enableAdminControls() {
		this.adminControlsEnabled = true
	}

	updateRegistrationState(value: boolean) {
		this.srEvent.isRegistrationOpen = value
		this.speedrunEventService.editSpeedrunEvent(this.srEvent)
			.subscribe(
				(srEvent: SpeedrunEvent) => {
					this.snackBar.open(`Event registration ${srEvent.isRegistrationOpen ? 'opened' : 'closed'} successfully!`, '', {
						duration: 5000,
						panelClass: ['snack-success', 'no-action']
					})
				},
				(err: any) => {
					this.snackBar.open('Failed to update event registration state!', '', {
						duration: 5000,
						panelClass: ['snack-warn', 'no-action']
					})
					console.error('FAILED TO OPEN/CLOSE EVENT REGISTRATION')
					this.srEvent.isRegistrationOpen = !value
				})
	}

	onFormChange() {
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

	handlePayment(button: any) {
		this.isFetching = true

		// Get latest info to see if registration is still open
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.srEvent = srEvent
				this.paymentAmount = srEvent.registrationCost || 0
				this.isFetching = false

				if (srEvent.registeredUsersCount >= srEvent.maxRegisteredUsers) {
					// Do something when cap is reached
				} else {
					this.handler.open({
						amount: this.paymentAmount * 100,
						description: 'Attendee fee',
						name: this.srEvent.name,
					})
				}
			})
	}

	@HostListener('window:popstate')
		onPopstate() {
			this.handler.close()
		}

}
