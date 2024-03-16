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

	constructor(private speedrunEventService: SpeedrunEventService) { }

	ngOnInit() {
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
        this.closeDate = new Date(srEvent.dates.volunteers.applicationsClose)
        this.scheduleDate = new Date(srEvent.dates.volunteers.scheduleRelease)
			})
  }
}
