import { Component, OnInit } from '@angular/core'

import { AuthenticationService } from '../authentication.service'

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	// TODO: Don't hardcode this
	mode: 'pre'|'off'|'event' = 'pre'

	constructor(private auth: AuthenticationService) { }

	ngOnInit() {
	}

}
