import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatButton, MatDialog, MatDialogRef } from '@angular/material'
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
	isDebouncing: boolean = false
	@ViewChild('stepper') stepper: any

	constructor(
		private auth: AuthenticationService,
		private submissionService: SubmissionService,
		public dialog: MatDialog
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

		const dialogRef = this.dialog.open(SubmissionConfirmationDialogComponent, {
			width: '800px',
			data: { game: this.games[index].name || 'New Game' }
		})

		dialogRef.afterClosed().subscribe((shouldRemove: boolean) => {
			if (shouldRemove) {
				let game
				game = this.games.splice(index, 1)[0]

				// Remove submission from database
				const gameId = game._id
				if (gameId) {
					this.submissionService.deleteSubmission(gameId)
						.subscribe((res: any) => {
							// Maybe do something
						})
				}
			}
		})
	}

	submitGame(game: GameSubmission, form: any, buttons: MatButton[]) {
		if (!form.valid || this.isDebouncing) {
			return false
		}

		// Debounce buttons
		this.isDebouncing = true
		buttons.forEach((btn: MatButton) => btn.disabled = true)
		game.public = false
		if (game._id) {
			// PUT
			this.submissionService.editSubmission(game)
				.subscribe((res: any) => {
					this.isDebouncing = false
					buttons.forEach((btn: MatButton) => btn.disabled = false)
				})
		} else {
			// POST
			this.submissionService.createSubmission(game)
				.subscribe((res: any) => {
					this.isDebouncing = false
					buttons.forEach((btn: MatButton) => btn.disabled = false)
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

export interface DialogData {
	game: string,
	body?: string
}

@Component({
	selector: 'app-submission-confirmation-dialog',
	templateUrl: 'submission-confirmation-dialog.html',
})
export class SubmissionConfirmationDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<SubmissionConfirmationDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData
	) {}

	onNoClick(): void {
		this.dialogRef.close()
	}
}
