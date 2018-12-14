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
	message: string

	constructor(private auth: AuthenticationService, private router: Router) { }

	register() {
		if (this.form.valid) {
			this.auth.register(this.model)
				.subscribe(
					(res: any) => {
						this.form.reset()
						// TODO: Require email verification
						this.message = 'User created successfully! Redirecting to profile page...'
						setTimeout(() => {
							this.router.navigate(['users'])
						},         1500)
					},
					(err: any) => {
						console.error('Error creating user.', err)
						this.message = 'Error creating user (see console)'
					} )
		}
	}
}
