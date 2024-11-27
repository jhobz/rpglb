import { Component, OnInit } from "@angular/core"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"

@Component({
    selector: "app-submission-guidelines-page",
    templateUrl: "./submission-guidelines-page.component.html",
    styleUrls: ["./submission-guidelines-page.component.css"],
})
export class SubmissionGuidelinesPageComponent implements OnInit {
    speedrunEvent: SpeedrunEvent

    constructor(private speedrunEventService: SpeedrunEventService) {}

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent) => {
                this.speedrunEvent = srEvent
            })
    }
}
