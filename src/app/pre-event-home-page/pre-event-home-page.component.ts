import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'app-pre-event-home-page',
	templateUrl: './pre-event-home-page.component.html',
	styleUrls: ['./pre-event-home-page.component.scss']
})
export class PreEventHomePageComponent implements OnInit {
	// TODO: Don't hardcode this
	event: string = 'RPG Limit Break 2019'

	constructor() { }

	ngOnInit() {
	}

}
