import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material'

import { AuthenticationService } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'

@Component({
	selector: 'app-submissions-list-page',
	templateUrl: './submissions-list-page.component.html',
	styleUrls: ['./submissions-list-page.component.scss']
})
export class SubmissionsListPageComponent implements OnInit {
	// TODO: don't hardcode this
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

	enableAdminControls() {
		this.adminControlsEnabled = true
	}

	updateSubmissionState(value: boolean) {
		this.speedrunEvent.areGameSubmissionsOpen = value
		this.speedrunEventService.editSpeedrunEvent(this.speedrunEvent)
			.subscribe(
				(srEvent: SpeedrunEvent) => {
					this.snackBar.open(`Game submissions ${srEvent.areGameSubmissionsOpen ? 'opened' : 'closed'} successfully!`, '', {
						duration: 5000,
						panelClass: ['snack-success', 'no-action']
					})
				},
				(err: any) => {
					this.snackBar.open('Failed to update game submission state!', '', {
						duration: 5000,
						panelClass: ['snack-warn', 'no-action']
					})
					console.error('FAILED TO OPEN/CLOSE SUBMISISONS')
					this.speedrunEvent.areGameSubmissionsOpen = !value
				})
	}

}
