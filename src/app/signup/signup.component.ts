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
		confirm: '',
		email: '',
		firstName: '',
		lastName: ''
	}
	@ViewChild('f') form: any
	hidePassword: boolean = true
	hidePassword2: boolean = true
	errorMessage: string = ''
	successMessage: string = ''
	isDebouncing: boolean = false

	constructor(private auth: AuthenticationService, private router: Router) { }

	register() {
		// TODO: Probably convert this check to a proper form validator eventually
		if (this.form.form.value.password !== this.form.form.value.confirmPassword) {
			this.errorMessage = 'Passwords must match.'
			this.isDebouncing = false
			return false
		}
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
