import { Component, OnInit, ViewChild } from '@angular/core'

import { AuthenticationService, PasswordData, TokenUserInfo } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'
import { GameSubmission, GameSubmissionResponse, SubmissionService } from '../submission.service'
import { User } from '../user'

@Component({
	providers: [SubmissionService],
	selector: 'app-profile',
	styleUrls: ['./profile.component.css'],
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
	userFromToken: TokenUserInfo
	user: User
	games: GameSubmission[]
	passwordData: PasswordData = {
		username: '',
		current: '',
		new: '',
		confirm: ''
	}
	hidePassword: boolean = true
	hidePassword2: boolean = true
	hidePassword3: boolean = true
	status: 'warn'|'success'
	statusMessage: string = ''
	@ViewChild('f') form: any
	speedrunEvent: SpeedrunEvent

	constructor(
		private auth: AuthenticationService,
		private submissionService: SubmissionService,
		private speedrunEventService: SpeedrunEventService) { }

	ngOnInit() {
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
				this.submissionService.getSubmissionsForUser(this.userFromToken._id, this.speedrunEvent._id)
					.map((data: GameSubmissionResponse) => data.docs )
					.subscribe((data: GameSubmission[]) => {
						this.games = data
					})
			})
		this.userFromToken = this.auth.getUserInfo()
		this.auth.profile().subscribe((usr: User) => {
			// If there's any mis-match in the user info on the server and the info from the token, log out
			if (this.userFromToken.username !== usr.username ||
				this.userFromToken.roles.length !== usr.roles.length ||
				!this.userFromToken.roles.sort().every((value: string, index: number) => value === usr.roles.sort()[index])) {
					this.auth.logout()
					location.reload()
			}
			this.user = usr
		})
	}

	changePassword() {
		if (this.passwordData.new !== this.passwordData.confirm) {
			this.status = 'warn'
			this.statusMessage = 'New passwords must match'
			return false
		}
		this.passwordData.username = this.user.username
		this.auth.changePassword(this.passwordData)
			.map((data: any) => data.token)
			.subscribe((token: string) => {
				this.auth.updateToken(token)
				this.form.resetForm()
				this.status = 'success'
				this.statusMessage = 'Password changed successfully'
			})
	}

}
