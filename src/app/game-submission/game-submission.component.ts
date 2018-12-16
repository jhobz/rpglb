import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component, Input, OnInit } from '@angular/core'

import { GameCategory, GameSubmission } from '../submission.service'

@Component({
	selector: 'app-game-submission',
	templateUrl: './game-submission.component.html',
	styleUrls: ['./game-submission.component.css'],
	animations: [
		trigger('fadeInOut', [
			state('in', style({ opacity: 1, background: 'transparent' })),
			transition(':enter', [
				style({
					background: '#1976d2' // Primary theme color
				}),
				animate('0.5s ease-in-out')
			]),
			transition(':leave', [
				animate('0.3s ease-out', style({ opacity: 0 }))
			])
		])
	]
})
export class GameSubmissionComponent implements OnInit {
	@Input() runnerId: string

	@Input() game: GameSubmission = {
		runner: this.runnerId,
		name: '',
		console: '',
		description: '',
		pros: '',
		cons: '',
		public: false,
		categories: [{ _id: 0 } as GameCategory]
	}

	constructor() { }

	ngOnInit() {
	}

	addCategory() {
		const id = this.game.categories.length
		this.game.categories.push({ _id: id } as GameCategory)
	}

	removeCategory(id: number) {
		const len = this.game.categories.length
		if (len === 1) {
			// TODO: Display some kind of error message
			return
		}

		if (len > id) {
			// GameSubmission must have at least one CategorySubmission
			this.game.categories.splice(id, 1)
			// Update ids of remaining categories
			this.game.categories.forEach((item: GameCategory, i: number) => {
				item._id = i
			})
		}
	}

}
