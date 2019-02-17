import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { MatSnackBar } from '@angular/material'

import { environment } from '../../environments/environment'
import { AuthenticationService, TokenUserInfo } from '../authentication.service'
import { PaymentService } from '../payment.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'
import { User } from '../user'
import { UserService } from '../user.service'

interface StartEndDateModel {
	startDate: Date,
	endDate: Date
}

@Component({
	selector: 'app-registration-page',
	templateUrl: './registration-page.component.html',
	styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {
	user: TokenUserInfo|User
	minDate: Date = new Date(2019, 4, 1)
	maxDate: Date = new Date(2019, 4, 15)
	dates: StartEndDateModel = {} as StartEndDateModel
	handler: any
	paymentAmount: number
	srEvent: SpeedrunEvent
	hasFullUserLoaded: boolean = false
	isFetching: boolean = false
	isProcessingPayment: boolean = false
	spinnerMessage: string = 'Fetching user details...'
	spinnerError: string
	hasEventRole: boolean = false
	adminControlsEnabled: boolean = false

	@ViewChild('f') form: any

	constructor(
		private auth: AuthenticationService,
		private speedrunEventService: SpeedrunEventService,
		private paymentService: PaymentService,
		private userService: UserService,
		private snackBar: MatSnackBar
	) {
		this.user = this.auth.getUserInfo()
		this.hasEventRole = this.user && this.user.roles &&
			(this.user.roles.includes('event') || this.user.roles.includes('admin'))
		this.auth.profile().subscribe((user: User) => {
			this.user = user
			this.dates = user.attendanceDates || {} as StartEndDateModel
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
			key: environment.stripeKey,
			image: 'https://rpglimitbreak.com/favicon.png',
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

	onDateChange() {
		if (this.form.valid) {
			// At this point, this.user *must* be an instance of User, as date fields only appear once this happens
			(<User>this.user).attendanceDates = this.dates
			this.userService.editUser(<User>this.user)
				.subscribe(
					(res: any) => {
						this.snackBar.open('Dates saved', '', {
							duration: 5000,
							panelClass: ['snack-success', 'no-action']
						})
					},
					(err: any) => {
						this.snackBar.open('Dates failed to save', '', {
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
						name: this.srEvent.name,
						description: 'Attendee fee',
						amount: this.paymentAmount * 100
					})
				}
			})
	}

	@HostListener('window:popstate')
		onPopstate() {
			this.handler.close()
		}

}
