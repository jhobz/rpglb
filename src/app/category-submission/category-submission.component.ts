import { Component, Input, ViewChild } from '@angular/core'
import { ControlContainer, FormControl, FormGroup, NgForm, NgModel } from '@angular/forms'

import { GameCategory } from '../submission.service'
import { convertMinutesToTimeString, convertTimeStringToMinutes } from '../time-range.directive'


@Component({
	selector: 'app-category-submission',
	templateUrl: './category-submission.component.html',
	styleUrls: ['./category-submission.component.css'],
	viewProviders: [ { provide: ControlContainer, useExisting: NgForm }]
})
export class CategorySubmissionComponent {
	@Input()
	set category(category: GameCategory) {
		this._category = category
		if (category.estimate && !category.estimateTimeString) {
			const timeString = convertMinutesToTimeString(category.estimate)
			if (timeString !== false) {
				this._category.estimateTimeString = timeString
			}
		}
	}
	get category(): GameCategory {
		return this._category
	}

	@ViewChild('estimate') estimateControl: NgModel

	private _category: GameCategory = {
		name: '',
		estimateTimeString: '',
		estimate: null,
		description: '',
		selectionStatus: 0,
		video: ''
	}

	constructor() { }

	onEstimateChange(inputValue: string) {
		const time = convertTimeStringToMinutes(inputValue)

		// Specifically using !== false here to avoid valid use of falsey values (like 0)
		if (time !== false) {
			this.category.estimate = time
		}
	}

}
