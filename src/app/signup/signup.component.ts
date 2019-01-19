import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

import { AuthenticationService, TokenPayload } from '../authentication.service'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent {
	model: TokenPayload = {
		username: '',
		password: '',
		email: '',
		firstName: '',
		lastName: ''
	}
	@ViewChild('f') form: any
	hidePassword: boolean = true
	errorMessage: string = ''
	successMessage: string = ''
	isDebouncing: boolean = false

	constructor(private auth: AuthenticationService, private router: Router) { }

	register() {
		if (this.form.valid) {
			this.isDebouncing = true
			this.auth.register(this.model)
				.subscribe(
					(res: any) => {
						// TODO: Require email verification
						this.successMessage = 'User created successfully! Redirecting to profile page...'
						setTimeout(() => {
							this.router.navigateByUrl(`/verify?user=${res.data._id}`)
						},         1500)
					},
					(err: any) => {
						this.errorMessage = 'Error: An account already exists with that username or email address.'
						this.isDebouncing = false
					} )
		}
	}
}
