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
	attendees: User[] = []

	constructor(public auth: AuthenticationService, private userService: UserService, private router: Router) { }

	getUsers() {
		this.userService.getUsers({limit: 100000})
			.subscribe(
				(users: User[]) => {
					this.userList = users
					this.attendees = this.userList.filter(u => u.roles.includes('attendee'))
				},
				(err: any) => {
					if (err.status === 401) {
						this.router.navigate(['login'])
					} else {
						console.error(err.message)
					}
				})
	}
}
