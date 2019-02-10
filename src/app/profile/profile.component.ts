import { Component, OnInit, ViewChild } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { AuthenticationService, PasswordData, TokenUserInfo } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'
import { GameSubmission, GameSubmissionResponse, SubmissionService } from '../submission.service'

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [SubmissionService]
})
export class ProfileComponent implements OnInit {
	user: TokenUserInfo
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
			})
		this.user = this.auth.getUserInfo()
		this.submissionService.getSubmissionsForUser(this.user._id)
			.map((data: GameSubmissionResponse) => data.docs )
			.subscribe((data: GameSubmission[]) => {
				this.games = data
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
