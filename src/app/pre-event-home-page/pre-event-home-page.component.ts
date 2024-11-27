import { Component, OnInit } from "@angular/core"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"

@Component({
    selector: "app-pre-event-home-page",
    templateUrl: "./pre-event-home-page.component.html",
    styleUrls: ["./pre-event-home-page.component.scss"],
})
export class PreEventHomePageComponent implements OnInit {
    event: string = "RPG Limit Break"
    speedrunEvent: SpeedrunEvent
    registrationStatus: "pre" | "open" | "closed"

    constructor(private speedrunEventService: SpeedrunEventService) {}

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.speedrunEvent = srEvent
                this.event = srEvent.name
                this.registrationStatus =
                    new Date(srEvent.dates.registration.open).getTime() >
                    Date.now()
                        ? "pre"
                        : "closed"
                if (srEvent.isRegistrationOpen) {
                    this.registrationStatus = "open"
                }
            })
    }
}
