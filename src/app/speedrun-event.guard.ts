import { Injectable } from "@angular/core"
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from "@angular/router"
import { Observable } from "rxjs/Observable"
import { SpeedrunEvent, SpeedrunEventService } from "./speedrun-event.service"

@Injectable()
export class SpeedrunEventGuard implements CanActivate {
    constructor(
        private speedrunEventService: SpeedrunEventService,
        private router: Router
    ) {}

    ngOnInit() {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        let route: string
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                route = this.getRoute(srEvent)
                this.router.navigate([route], {
                    skipLocationChange: state.url === "/",
                })
            })
        return true
    }

    getRoute(speedrunEvent: SpeedrunEvent): string {
        switch (speedrunEvent.state) {
            case "live":
                return "/event"
            case "pre":
            case "post":
                // TODO: Make a unified home page for pre & post and simply change the info
                //       or load a different subcomponent based on state
                return "/pre"
        }
    }
}
