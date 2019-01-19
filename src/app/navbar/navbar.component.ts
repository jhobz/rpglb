import { Component, OnInit } from '@angular/core'

import { AuthenticationService } from '../authentication.service'

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	// TODO: Don't hardcode these
	mode: 'pre'|'off'|'event' = 'pre'
	areSubmissionsOpen: boolean = false

	constructor(private auth: AuthenticationService) { }

	ngOnInit() {
	}

	logout() {
		this.auth.logout()
	}

	isLoggedIn(): boolean {
		return this.auth.isLoggedIn()
	}

}
