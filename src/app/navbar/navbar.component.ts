import { Component, OnInit } from '@angular/core'

import { AuthenticationService } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	// TODO: Don't hardcode these
	mode: 'pre'|'off'|'event' = 'pre'
	hasSubmissionRole: boolean
	speedrunEvent: SpeedrunEvent

	constructor(
		private auth: AuthenticationService,
		private speedrunEventService: SpeedrunEventService
	) { }

	ngOnInit() {
		const user = this.auth.getUserInfo()
		this.hasSubmissionRole = user && user.roles && (user.roles.includes('submissions') || user.roles.includes('admin'))

		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
			})
	}

	logout() {
		this.auth.logout()
	}

	isLoggedIn(): boolean {
		return this.auth.isLoggedIn()
	}

}
