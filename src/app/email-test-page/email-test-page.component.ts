import { Component, OnInit } from "@angular/core"
import { AuthenticationService, TokenUserInfo } from "../authentication.service"
import { Router } from "@angular/router"

@Component({
    selector: "app-email-test-page",
    templateUrl: "./email-test-page.component.html",
    styleUrls: ["./email-test-page.component.css"],
})
export class EmailTestPageComponent implements OnInit {
    user: TokenUserInfo

    constructor(private auth: AuthenticationService, private router: Router) {}

    ngOnInit() {
        this.user = this.auth.getUserInfo()
        if (
            !this.user ||
            !this.user.roles ||
            !this.user.roles.includes("admin")
        ) {
            this.router.navigate(["/"])
        }
    }
}
