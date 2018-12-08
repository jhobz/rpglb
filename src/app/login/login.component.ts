import { HttpClient } from '@angular/common/http'
import { Component, NgModule, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { catchError, tap } from 'rxjs/operators'

import { UserService } from '../user.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [UserService]
})
export class LoginComponent implements OnInit {
	loginData: any = {
		username: '',
		password: ''
	}
	@ViewChild('f') form: any
	message: string = ''
	data: any

	constructor(private userService: UserService, private router: Router) { }

	login() {
		if (this.form.valid) {
			this.userService.loginUser(this.loginData)
				.subscribe(
					(res: any) => {
						this.data = res
						localStorage.setItem('jwtToken', this.data.token)
						this.router.navigate(['users'])
					},
					(err: any) => {
						this.message = err.error.message
					})
		}
	}

	ngOnInit() {
	}

}
