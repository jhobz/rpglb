import { Component, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"

import { UserService } from "../user.service"

@Component({
    selector: "app-password-reset-page",
    styleUrls: ["./password-reset-page.component.css"],
    templateUrl: "./password-reset-page.component.html",
})
export class PasswordResetPageComponent implements OnInit {
    status: "warn" | "success" | "info"
    statusMessage: string
    showPasswordInputs: boolean = false
    isFetching: boolean = false
    emailData: string
    passwordData: any = {
        confirm: "",
        new: "",
    }
    hidePassword: boolean = true
    hidePassword2: boolean = true
    queryParams: any
    @ViewChild("btn") emailButton: any
    @ViewChild("f") form: any

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (!params.user || !params.token) {
                // this.status = "info"
                // this.statusMessage =
                //     "This is the password reset page. It does not appear that you have submitted a " +
                //     "reset request. Check your email for a message from website@rpglimitbreak.com, or fill in your " +
                //     "email and click the button below to send a new reset request."
            } else {
                this.showPasswordInputs = true
            }

            this.queryParams = params
        })
    }

    resetPassword() {
        if (this.passwordData.new !== this.passwordData.confirm) {
            this.status = "warn"
            this.statusMessage =
                "Passwords must match and be at least 12 characters long"
            return false
        }

        this.isFetching = true
        this.status = "info"
        this.statusMessage = "Attempting to reset password..."

        this.userService
            .resetPassword(
                this.queryParams.user,
                this.queryParams.token,
                this.passwordData.new
            )
            .subscribe(
                (res: any) => {
                    this.status = "success"
                    this.statusMessage =
                        "Password successfully reset! Redirecting to login page..."
                    setTimeout(() => {
                        this.router.navigate(["login"])
                    }, 1500)
                },
                (err: any) => {
                    this.isFetching = false
                    this.status = "warn"
                    this.statusMessage =
                        "Password reset failed. Your reset token may be incorrect or may have expired. " +
                        "Use the form below to send another email."
                    console.error(err.error.message, err.error)

                    this.showPasswordInputs = false
                }
            )
    }

    sendPasswordResetEmail() {
        this.isFetching = true
        this.userService.sendPasswordResetEmail(this.emailData).subscribe(
            (res: any) => {
                this.isFetching = false
                this.emailButton.disabled = true
                this.status = "success"
                this.statusMessage = res.message
            },
            (err: any) => {
                this.status = "warn"
                this.statusMessage =
                    "Failed to send password reset email. Try again later or contact an administrator."
                console.error(err.error.message, err.error)
            }
        )
    }
}
