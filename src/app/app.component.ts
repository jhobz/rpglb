import { Component, OnInit } from "@angular/core"
import { SpeedrunEvent, SpeedrunEventService } from "./speedrun-event.service"
import { NavigationEnd, NavigationStart, Router } from "@angular/router"
import { Location, PopStateEvent } from "@angular/common"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    title = "RPG Limit Break"
    speedrunEvent: SpeedrunEvent
    private lastPoppedUrl: string
    private yScrollStack: number[] = []

    constructor(
        private speedrunEventService: SpeedrunEventService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit() {
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.speedrunEvent = srEvent
            })

        // Fix route navigation not scrolling back to top
        // https://stackoverflow.com/questions/39601026/angular-2-scroll-to-top-on-route-change
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url
        })
        this.router.events.subscribe((ev: any) => {
            if (ev instanceof NavigationStart) {
                if (ev.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY)
            } else if (ev instanceof NavigationEnd) {
                if (ev.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined
                    window.scrollTo(0, this.yScrollStack.pop())
                } else window.scrollTo(0, 0)
            }
        })
    }
}
