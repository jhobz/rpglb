import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { User } from '../user'
import { UserService } from '../user.service'

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css'],
	providers: [UserService]
})

export class UserListComponent implements OnInit {
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

	ngOnInit() {
	}

}
