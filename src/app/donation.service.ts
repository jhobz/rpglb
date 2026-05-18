import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import "rxjs/add/operator/map"
import { Observable } from "rxjs/Observable"

import { SpeedrunEvent } from "./speedrun-event.service"
import { APIMilestone, PaginationInfo, TrackerEvent } from "./tracker-json"

@Injectable()
export class DonationService {
    // TODO: Should be read from an environment variable
    private trackerBase: string = "https://tracker.rpglimitbreak.com/api/v2"

    constructor(private http: HttpClient) {}

    getTotalForEvent(event: SpeedrunEvent): Observable<number> {
        return this.http
            .get<
                PaginationInfo<TrackerEvent>
            >(`${this.trackerBase}/events?totals=&short=${event.trackerId}`)
            .map((data: PaginationInfo<TrackerEvent>) => {
                return data.results[0]?.donation_total || 0
            })
    }

    getGoalForEvent(event: SpeedrunEvent): Observable<number> {
        return this.http
            .get<
                PaginationInfo<APIMilestone>
            >(`${this.trackerBase}/milestones.json`)
            .map((data: PaginationInfo<APIMilestone>) => {
                return (
                    data.results.filter(
                        (milestone) =>
                            milestone.event?.short === event.trackerId,
                    )[0]?.amount || 0
                )
            })
    }
}
