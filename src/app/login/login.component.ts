import { HttpClient } from '@angular/common/http'
import { Component, NgModule, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'

import { AuthenticationService, TokenPayload } from '../authentication.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginData: TokenPayload = {
		username: '',
		password: ''
	}
	@ViewChild('f') form: any
	message: string = ''
	successMessage: string = ''
	hidePassword: boolean = true
	isDebouncing: boolean = false

	constructor(private auth: AuthenticationService, private router: Router) { }

	login() {
		if (this.form.valid) {
			this.isDebouncing = true
			this.auth.login(this.loginData)
				.subscribe(
					(res: any) => {
						this.successMessage = 'Login successful! Redirecting...'
						const redirect = this.auth.redirectUrl ? this.auth.redirectUrl : '/profile'
						// TODO: Re-evaluate timeout
						setTimeout(() => {
							this.router.navigate([redirect])
						},         1500)
					},
					(err: any) => {
						if (err.error.message === 'Login failed. Email is not verified.') {
							this.successMessage = 'Redirecting...'
							setTimeout(() => {
								this.router.navigateByUrl(`/verify?user=${err.error.user}`)
							},         1500)
						}
						this.message = err.error.message
						this.isDebouncing = false
					})
		}
	}

	ngOnInit() {
		// Redirect user if already logged in
		if (this.auth.isLoggedIn()) {
			this.successMessage = 'Already logged in, redirecting...'
			// TODO: Re-evaluate timeout
			setTimeout(() => {
				this.router.navigate(['profile'])
			},         1500)
		}
	}

}
