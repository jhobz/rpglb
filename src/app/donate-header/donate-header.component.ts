import { HttpErrorResponse } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'

import { DonationService } from '../donation.service'
import { DonationData, SpeedrunEvent } from '../speedrun-event'

@Component({
	selector: 'app-donate-header',
	templateUrl: './donate-header.component.html',
	styleUrls: ['./donate-header.component.scss'],
	providers: [DonationService]
})
export class DonateHeaderComponent implements OnInit {
	event: SpeedrunEvent = new SpeedrunEvent()

	constructor(private donationService: DonationService) {
		// TODO: #149 MAKE THIS ACTUALLY PULL FROM THE SPEEDRUN EVENT WTH
		// this.event.name = 'RPG Limit Break 2023'
		// this.event.shortName = 'rpglb2023'
		// this.event.cause = 'NAMI: National Alliance on Mental Illness'
		// this.event.causeLink = 'https://www.nami.org'
		// this.event.trackerId = 11
		// this.event.donations = { total: 0, goal: 100000 }
	}

	ngOnInit() {
		this.donationService.getTotalForEvent(this.event)
			.subscribe(
				(total: string) => this.event.donations.total = Number(total),
				(error: HttpErrorResponse) => console.error('Error getting donation total', error)
			)
		this.donationService.getGoalForEvent(this.event)
			.subscribe(
				(goal: string) => this.event.donations.goal = Number(goal),
				(error: HttpErrorResponse) => console.error('Error getting donation goal', error)
			)
	}

}
