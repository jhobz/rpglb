import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { AuthenticationService, TokenUserInfo } from '../authentication.service'
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
	// TODO: Don't hardcode this value
	event: string = 'RPG Limit Break 2019'

	constructor(private auth: AuthenticationService, private submissionService: SubmissionService) { }

	ngOnInit() {
		this.user = this.auth.getUserInfo()
		this.submissionService.getSubmissionsForUser(this.user._id)
			.map((data: GameSubmissionResponse) => data.docs )
			.subscribe((data: GameSubmission[]) => {
				this.games = data
			})
	}

}
