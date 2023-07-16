import { Component } from '@angular/core'
import { SpeedrunEvent, SpeedrunEventService } from './speedrun-event.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'RPG Limit Break'
    speedrunEvent: SpeedrunEvent

    constructor(private speedrunEventService: SpeedrunEventService) {}

    ngOnInit() {
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
			})
    }
}
