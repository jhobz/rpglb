import { Component, OnInit } from "@angular/core"

import { AuthenticationService } from "../authentication.service"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
    mode: "pre" | "live" | "post"
    hasSubmissionRole: boolean
    speedrunEvent: SpeedrunEvent
    username: string

    constructor(
        private auth: AuthenticationService,
        private speedrunEventService: SpeedrunEventService
    ) {}

    ngOnInit() {
        const user = this.auth.getUserInfo()
        this.username = user && user.username
        this.hasSubmissionRole =
            user &&
            user.roles &&
            (user.roles.includes("submissions") || user.roles.includes("admin"))

        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.speedrunEvent = srEvent
                this.mode = this.speedrunEvent.state
            })
    }

    logout(e: MouseEvent) {
        e.preventDefault()
        this.auth.logout()
    }

    isLoggedIn(): boolean {
        const user = this.auth.getUserInfo()
        this.username = user && user.username
        return this.auth.isLoggedIn()
    }
}
