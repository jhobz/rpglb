import { HttpErrorResponse } from "@angular/common/http"
import { Component, OnDestroy, OnInit } from "@angular/core"

import { DonationService } from "../donation.service"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"

const ANIM_DURATION = 2000
const easeOutQuad = (t: number) => t * (2 - t)

@Component({
    selector: "app-donate-header",
    templateUrl: "./donate-header.component.html",
    styleUrls: ["./donate-header.component.scss"],
    providers: [DonationService],
})
export class DonateHeaderComponent implements OnInit, OnDestroy {
    event: SpeedrunEvent
    donations: { total: number; goal: number }
    timer: number

    constructor(
        private speedrunEventService: SpeedrunEventService,
        private donationService: DonationService
    ) {
        this.donations = {} as { total: number; goal: number }
    }

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.event = srEvent
                this.timer = window.setInterval(
                    () => this.updateDonations(),
                    5000
                )
            })
    }

    // The animation function, which takes an Element
    animateCountUp = (start: number, end: number) => {
        let initialTime = 0

        const paint = () =>
            requestAnimationFrame((timestamp) => {
                if (!initialTime) {
                    initialTime = timestamp
                }
                const elapsed = timestamp - initialTime
                const progress = easeOutQuad(elapsed / ANIM_DURATION)
                const realNumber = start + progress * (end - start)
                const displayNumber = Math.round(realNumber * 100) / 100

                // Make 100% sure the correct number is displayed at the end
                if (elapsed >= ANIM_DURATION) {
                    this.donations.total = end
                    return
                }

                this.donations.total = displayNumber
                paint()
            })

        paint()
    }

    updateDonations() {
        this.donationService.getTotalForEvent(this.event).subscribe(
            (total: string) => {
                this.animateCountUp(this.donations.total || 0, Number(total))
            },
            (error: HttpErrorResponse) => {
                console.error("Error getting donation total", error)
                this.donations.total = 0
            }
        )
        this.donationService.getGoalForEvent(this.event).subscribe(
            (goal: string) => (this.donations.goal = Number(goal)),
            (error: HttpErrorResponse) => {
                console.error("Error getting donation goal", error)
                this.donations.goal = 0
            }
        )
    }

    ngOnDestroy() {
        if (!this.timer) {
            return
        }

        window.clearInterval(this.timer)
    }
}
