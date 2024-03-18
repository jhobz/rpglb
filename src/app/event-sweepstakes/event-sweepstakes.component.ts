import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { DonationService } from '../donation.service';
import { DonationData, SpeedrunEvent } from '../speedrun-event';

@Component({
	selector: 'app-event-sweepstakes',
	templateUrl: './event-sweepstakes.component.html',
	styleUrls: ['./event-sweepstakes.component.css'],
	providers: [DonationService]
})
export class EventSweepstakesComponent implements OnInit {
	event: SpeedrunEvent = new SpeedrunEvent();
	isChatOpen: boolean = false;

	constructor(private donationService: DonationService) {
		// TODO: #150 MAKE THIS ACTUALLY PULL FROM THE SPEEDRUN EVENT WTH
		// this.event.name = 'RPG Limit Break 2018';
		// this.event.shortName = 'rpglb2018';
		// this.event.cause = 'NAMI: National Alliance on Mental Illness';
		// this.event.causeLink = 'https://www.nami.org';
		// this.event.trackerId = 6;
		// this.event.donations = { total: 0, goal: 0 };
	}

	ngOnInit() {
		this.donationService.getTotalForEvent(this.event)
			.subscribe(
				(total: string) => this.event.donations.total = Number(total),
				(error: HttpErrorResponse) => console.error('Error getting donation total', error)
			);
		this.donationService.getGoalForEvent(this.event)
			.subscribe(
				(goal: string) => this.event.donations.goal = Number(goal),
				(error: HttpErrorResponse) => console.error('Error getting donation goal', error)
			);
	}

}
