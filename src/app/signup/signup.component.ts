import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

import { User } from '../user'
import { UserService } from '../user.service'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
	providers: [UserService]
})
export class SignupComponent implements OnInit {
	model: User = new User()
	@ViewChild('f') form: any
	message: string

	constructor(private userService: UserService, private router: Router) { }

	onSubmit() {
		if (this.form.valid) {
			this.userService.createUser(this.model)
				.subscribe(
					(res: any) => {
						this.form.reset()
						// TODO: Require email verification
						this.message = 'User created successfully! Redirecting to login page...'
						setTimeout(() => {
							this.router.navigate(['login'])
						},         1500)
					},
					(err: any) => {
						console.error('Error creating user.', err)
						this.message = 'Error creating user (see console)'
					} )
		}
	}

	ngOnInit() {
		// Log user out if they manage to reach the signup page while logged in
		const token = localStorage.getItem('jwtToken')
		if (token) {
			localStorage.removeItem('jwtToken')
		}
	}

}
