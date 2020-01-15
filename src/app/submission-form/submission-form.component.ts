import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatButton, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material'
import { of } from 'rxjs/observable/of'

import { AuthenticationService } from '../authentication.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'
import { GameSubmission, GameSubmissionResponse, RunnerData, SubmissionService } from '../submission.service'

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
	areSubmissionsOpen: boolean
	@ViewChild('stepper') stepper: any

	constructor(
		private auth: AuthenticationService,
		private submissionService: SubmissionService,
		private speedrunEventService: SpeedrunEventService,
		private snackBar: MatSnackBar,
		public dialog: MatDialog
	) {}

	ngOnInit() {
		const userId = this.auth.getUserInfo()._id
		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.areSubmissionsOpen = srEvent.areGameSubmissionsOpen

				this.submissionService.getSubmissionsForUser(userId, srEvent._id)
					.map((data: GameSubmissionResponse) => data.docs )
					.subscribe((data: GameSubmission[]) => {
						this.games = data
					})
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

		let game = this.games[index]

		const dialogRef = this.dialog.open(SubmissionConfirmationDialogComponent, {
			width: '800px',
			data: { game: game.name || 'New Game' }
		})

		dialogRef.afterClosed().subscribe((shouldRemove: boolean) => {
			if (shouldRemove) {
				// Remove submission from database
				const gameId = game._id
				if (gameId) {
					this.submissionService.deleteSubmission(gameId)
						.subscribe(
							(res: any) => {
								game = this.games.splice(index, 1)[0]
								this.snackBar.open('Submission deleted', '', {
									duration: 5000,
									panelClass: ['snack-success', 'no-action']
								})
							},
							(err: any) => {
								this.snackBar.open('Something went wrong... submission not deleted', '', {
									duration: 5000,
									panelClass: ['snack-warn', 'no-action']
								})
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
		if (game.runner.hasOwnProperty('_id')) {
			game.runner = (<RunnerData>game.runner)._id
		}
		game.public = false
		if (game._id) {
			// PUT
			this.submissionService.editSubmission(game)
				.subscribe(
					(res: any) => {
						this.isDebouncing = false
						buttons.forEach((btn: MatButton) => btn.disabled = false)
						this.snackBar.open('Submission saved!', '', {
							duration: 5000,
							panelClass: ['snack-success', 'no-action']
						})
					},
					(err: any) => {
						this.isDebouncing = false
						buttons.forEach((btn: MatButton) => btn.disabled = false)
						this.snackBar.open('Failed to update submission. Check the time, are game submissions closed?', '', {
							duration: 5000,
							panelClass: ['snack-warn', 'no-action']
						})
					})
		} else {
			// POST
			this.submissionService.createSubmission(game)
				.subscribe(
					(res: any) => {
						this.isDebouncing = false
						buttons.forEach((btn: MatButton) => btn.disabled = false)
						this.snackBar.open('Submission saved!', '', {
							duration: 5000,
							panelClass: ['snack-success', 'no-action']
						})
						// Set the proper id for the submission, now that the database has generated one
						game._id = res.data._id
					},
					(err: any) => {
						this.isDebouncing = false
						buttons.forEach((btn: MatButton) => btn.disabled = false)
						this.snackBar.open('Failed to create submission. Check the time, are game submissions closed?', '', {
							duration: 5000,
							panelClass: ['snack-warn', 'no-action']
						})
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
