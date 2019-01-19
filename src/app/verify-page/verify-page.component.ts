import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { UserService } from '../user.service'

@Component({
	selector: 'app-verify-page',
	templateUrl: './verify-page.component.html',
	styleUrls: ['./verify-page.component.css']
})
export class VerifyPageComponent implements OnInit {
	status: 'warn'|'success'|'info'
	statusMessage: string
	@ViewChild('btn') emailButton: any

	constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

	ngOnInit() {
		this.route.queryParams.subscribe((params: any) => {
			this.userService.verifyUser(params.user, params.token)
				.subscribe(
					(res: any) => {
						if (!res) {
							this.status = 'info'
							this.statusMessage = 'You haven\'t verified your email yet. Check your email for a message ' +
								'from rpglimitbreak@gmail.com. Click below to send a new email if you need one. This will ' +
								'invalidate the email previously sent to you.'
							return
						}
						this.status = 'success'
						this.statusMessage = 'Email successfully verified! Redirecting to login page...'
						setTimeout(() => {
							this.router.navigate(['login'])
						},         1500)
					}, (err: any) => {
						this.status = 'warn'
						this.statusMessage = 'Verification failed. Your token may have been expired. Click below to send another email.'
					})
		})
	}

	sendVerificationEmail() {
		this.route.queryParams.subscribe((params: any) => {
			this.userService.sendVerificationEmail(params.user)
				.subscribe(
					(res: any) => {
						this.emailButton.disabled = true
						this.status = 'success'
						this.statusMessage = res.message
					}, (err: any) => {
						this.status = 'warn'
						this.statusMessage = err.error.message
					})
		})
	}

}
