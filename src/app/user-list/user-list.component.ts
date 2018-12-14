import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { AuthenticationService } from '../authentication.service'
import { User } from '../user'
import { UserService } from '../user.service'

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css'],
	providers: [UserService]
})

export class UserListComponent {
	userList: User[] = []

	constructor(public auth: AuthenticationService, private userService: UserService, private router: Router) { }

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
}
