import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

import { DonationService } from "../donation.service";
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service";

@Component({
    selector: "app-donate-header",
    templateUrl: "./donate-header.component.html",
    styleUrls: ["./donate-header.component.scss"],
    providers: [DonationService],
})
export class DonateHeaderComponent implements OnInit {
    event: SpeedrunEvent;
    donations: { total: number; goal: number };

    constructor(
        private speedrunEventService: SpeedrunEventService,
        private donationService: DonationService
    ) {
        this.donations = {} as { total: number; goal: number };
    }

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.event = srEvent;
                this.updateDonations();
            });
    }

    updateDonations() {
        this.donationService.getTotalForEvent(this.event).subscribe(
            (total: string) => (this.donations.total = Number(total)),
            (error: HttpErrorResponse) => {
                console.error("Error getting donation total", error);
                this.donations.total = 0;
            }
        );
        this.donationService.getGoalForEvent(this.event).subscribe(
            (goal: string) => (this.donations.goal = Number(goal)),
            (error: HttpErrorResponse) => {
                console.error("Error getting donation goal", error);
                this.donations.goal = 0;
            }
        );
    }
}
