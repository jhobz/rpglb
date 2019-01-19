import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-submissions-list-page',
	templateUrl: './submissions-list-page.component.html',
	styleUrls: ['./submissions-list-page.component.css']
})
export class SubmissionsListPageComponent implements OnInit {
	// TODO: don't hardcode this
	event: string = 'RPG Limit Break 2019'

	constructor() { }

	ngOnInit() {
	}

}
