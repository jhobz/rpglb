import "rxjs/add/operator/map"
import "rxjs/add/operator/take"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs/Observable"
import {
    Router,
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot,
} from "@angular/router"

import { SpeedrunEvent, SpeedrunEventService } from "./speedrun-event.service"

@Injectable()
export class SpeedrunEventResolver implements Resolve<SpeedrunEvent> {
    constructor(
        private srEventService: SpeedrunEventService,
        private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<SpeedrunEvent> {
        return this.srEventService
            .getCurrentSpeedrunEvent()
            .take(1)
            .map((srEvent) => srEvent || null)
    }
}
