import { Component, Input, ViewChild } from '@angular/core'
import { FormControl, NgModel } from '@angular/forms'

import { GameCategory } from '../submission.service'
import { convertTimeStringToMinutes } from '../time-range.directive'


@Component({
	selector: 'app-category-submission',
	templateUrl: './category-submission.component.html',
	styleUrls: ['./category-submission.component.css'],
})
export class CategorySubmissionComponent {
	@Input() category: GameCategory = {
		name: '',
		estimateTimeString: '',
		estimate: null,
		description: '',
		video: ''
	}
	@ViewChild('estimate') estimateControl: NgModel

	constructor() { }

	onEstimateChange(inputValue: string) {
		const time = convertTimeStringToMinutes(inputValue)

		// Specifically using !== false here to avoid valid use of falsey values (like 0)
		if (time !== false) {
			this.category.estimate = time
		}
	}

}
