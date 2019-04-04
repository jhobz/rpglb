import { Component, OnInit } from '@angular/core'

import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'

@Component({
	selector: 'app-pre-event-home-page',
	templateUrl: './pre-event-home-page.component.html',
	styleUrls: ['./pre-event-home-page.component.scss']
})
export class PreEventHomePageComponent implements OnInit {
	// TODO: Don't hardcode this
	event: string = 'RPG Limit Break 2019'
	speedrunEvent: SpeedrunEvent

	constructor(private speedrunEventService: SpeedrunEventService) { }

	ngOnInit() {
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
			})
	}

}
