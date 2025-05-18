import { HttpErrorResponse } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"

import { DonationService } from "../donation.service"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"
import { Router } from "@angular/router"

@Component({
    selector: "app-event-home",
    templateUrl: "./event-home.component.html",
    styleUrls: ["./event-home.component.scss"],
    providers: [DonationService],
})
export class EventHomeComponent implements OnInit {
    event: SpeedrunEvent
    isChatOpen: boolean = false
    chatButtonText: string = "Chat with viewers!"

    constructor(
        private speedrunEventService: SpeedrunEventService,
        private router: Router
    ) {}

    toggleChat() {
        this.isChatOpen = !this.isChatOpen
    }

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.event = srEvent
            })
        // this.donationService.getTotalForEvent(this.event)
        // 	.subscribe(
        // 		(total: string) => this.event.donations.total = Number(total),
        // 		(error: HttpErrorResponse) => console.error('Error getting donation total', error)
        // 	)
        // this.donationService.getGoalForEvent(this.event)
        // 	.subscribe(
        // 		(goal: string) => this.event.donations.goal = Number(goal),
        // 		(error: HttpErrorResponse) => console.error('Error getting donation goal', error)
        // 	)
    }
}
