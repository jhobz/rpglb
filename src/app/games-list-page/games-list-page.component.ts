import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material'

import { AuthenticationService } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'

@Component({
	selector: 'app-games-list-page',
	templateUrl: './games-list-page.component.html',
	styleUrls: ['./games-list-page.component.scss']
})
export class GamesListPageComponent implements OnInit {
	speedrunEvent: SpeedrunEvent
	hasSubmissionRole: boolean
	adminControlsEnabled: boolean = false

	constructor(
		private auth: AuthenticationService,
		private speedrunEventService: SpeedrunEventService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		const user = this.auth.getUserInfo()
		this.hasSubmissionRole = user && user.roles && (user.roles.includes('submissions') || user.roles.includes('admin'))

		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
			})
	}
}
