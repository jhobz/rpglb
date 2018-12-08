import { Component, NgModule, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import * as $ from 'jquery'

import { User } from '../user'
import { UserService } from '../user.service'

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css'],
	providers: [UserService]
})

export class UserListComponent implements OnInit {
	model: User = new User()
	@ViewChild('f') form: any
	userList: User[] = []

	constructor(private userService: UserService, private router: Router) { }

	getUsers() {
		this.userService.getUsers()
			.subscribe(
				(users: User[]) => {
					this.userList = users
				},
				(err: any) => {
					if (err.status === 401) {
						this.router.navigate(['login'])
					}
				})
	}

	onSubmit() {
		if (this.form.valid) {
			this.userService.createUser(this.model)
				.subscribe(
					(res: any) => {
						this.userList.push(res.data)
						this.form.reset()
					},
					(err: any) => {
						console.error('Error creating user.', err)
					} )
		}
	}

	ngOnInit() {
	}

}
