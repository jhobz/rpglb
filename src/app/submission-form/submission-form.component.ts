import { Component, OnInit, ViewChild } from '@angular/core'
import { of } from 'rxjs/observable/of'

import { AuthenticationService } from '../authentication.service'
import { GameSubmission, GameSubmissionResponse, SubmissionService } from '../submission.service'

@Component({
	selector: 'app-submission-form',
	templateUrl: './submission-form.component.html',
	styleUrls: ['./submission-form.component.css'],
	providers: [SubmissionService]
})
export class SubmissionFormComponent implements OnInit {
	// TODO: Don't hardcode this value
	event: string = 'RPG Limit Break 2019'
	games: GameSubmission[] = []
	maxGames: number = 5
	@ViewChild('stepper') stepper: any

	constructor(
		private auth: AuthenticationService,
		private submissionService: SubmissionService
	) {}

	ngOnInit() {
		const userId = this.auth.getUserInfo()._id
		this.submissionService.getSubmissionsForUser(userId)
			.map((data: GameSubmissionResponse) => data.docs )
			.subscribe((data: GameSubmission[]) => {
				this.games = data
			})
	}

	addGame() {
		const userId = this.auth.getUserInfo()._id
		this.games.push({runner: userId, categories: [{}]} as GameSubmission)
	}

	removeGame(index: number) {
		const len = this.games.length
		if (len === 0) {
			return false
		}

		let game
		game = this.games.splice(index, 1)[0]

		// Remove submission from database
		const gameId = game._id
		if (gameId) {
			this.submissionService.deleteSubmission(gameId)
				.subscribe((data) => {
					console.log('deleted', data)
				})
		}
	}

	submitGame(game: GameSubmission, form: any) {
		if (!form.valid) {
			return false
		}

		game.public = false
		if (game._id) {
			// PUT
			this.submissionService.editSubmission(game)
				.subscribe((data) => {
					console.log('edited', data)
				})
		} else {
			// POST
			this.submissionService.createSubmission(game)
				.subscribe((data) => {
					console.log('created', data)
				})
		}
	}

	resetStepper() {
		this.stepper.reset()
		this.games = [{categories: [{}]} as GameSubmission]
	}

	getObservableOfGames() {
		return of(this.games)
	}

}
