import { Component, Input, OnInit } from '@angular/core'

@Component({
	selector: 'app-donate-header',
	templateUrl: './donate-header.component.html',
	styleUrls: ['./donate-header.component.scss']
})
export class DonateHeaderComponent implements OnInit {
	@Input() event: any

	constructor() { }

	ngOnInit() {
	}

}
