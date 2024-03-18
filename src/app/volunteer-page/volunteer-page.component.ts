import { Component, OnInit } from "@angular/core"

import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"

@Component({
	selector: "app-volunteer-page",
	templateUrl: "./volunteer-page.component.html",
	styleUrls: ["./volunteer-page.component.scss"],
})
export class VolunteerPageComponent implements OnInit {
	speedrunEvent: SpeedrunEvent
	closeDate: Date
	scheduleDate: Date
	appLink: string

	constructor(private speedrunEventService: SpeedrunEventService) { }

	ngOnInit() {
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
				this.closeDate = new Date(srEvent.dates.volunteers.applicationsClose)
				this.scheduleDate = new Date(srEvent.dates.volunteers.scheduleRelease)
			})
		
		this.appLink = 'https://docs.google.com/forms/d/1RAsU9KUAbv0aoDU0oSd9TgJf9w1hDn5gIFAlhdOVSPk/viewform?edit_requested=true'
  }
}
