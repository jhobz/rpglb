import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { DonationService } from "../donation.service";
import { DonationData, SpeedrunEvent } from "../speedrun-event";

@Component({
	selector: "app-event-home",
	templateUrl: "./event-home.component.html",
	styleUrls: ["./event-home.component.css"],
	providers: [DonationService],
})
export class EventHomeComponent implements OnInit {
	event: SpeedrunEvent = new SpeedrunEvent();
	isChatOpen: boolean = false;
	chatButtonText: string = "Chat with viewers!";

	constructor(private donationService: DonationService) {
		// TODO: #148 This is all old and gross, really needs to be updated to pull stuff from the event object in the database
		this.event.name = "RPG Limit Break 2024";
		// this.event.shortName = 'rpglb2022'
		this.event.cause = "NAMI: National Alliance on Mental Illness";
		this.event.causeLink = "https://www.nami.org";
		// this.event.trackerId = 10
		// this.event.donations = { total: 50000, goal: 100000 }
	}

	toggleChat() {
		this.isChatOpen = !this.isChatOpen;
	}

	ngOnInit() {
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
