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

	constructor(private auth: AuthenticationService, private router: Router) { }

	login() {
		if (this.form.valid) {
			this.auth.login(this.loginData)
				.subscribe(
					(res: any) => {
						this.successMessage = 'Login successful! Redirecting...'
						const redirect = this.auth.redirectUrl ? this.auth.redirectUrl : '/users'
						setTimeout(() => {
							this.router.navigate([redirect])
						},         1500)
					},
					(err: any) => {
						this.message = err.error.message
					})
		}
	}

	ngOnInit() {
		// Redirect user if already logged in
		if (this.auth.isLoggedIn()) {
			this.successMessage = 'Already logged in, redirecting...'
			setTimeout(() => {
				this.router.navigate(['users'])
			},         1500)
		}
	}

}
