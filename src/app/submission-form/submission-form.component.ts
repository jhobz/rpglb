import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core"
import { FormControl } from "@angular/forms"
import {
    MAT_DIALOG_DATA,
    MatButton,
    MatDialog,
    MatDialogRef,
    MatSnackBar,
} from "@angular/material"
import { of } from "rxjs/observable/of"

import { AuthenticationService } from "../authentication.service"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"
import {
    GameSubmission,
    GameSubmissionResponse,
    RunnerData,
    SubmissionService,
} from "../submission.service"

@Component({
    selector: "app-submission-form",
    templateUrl: "./submission-form.component.html",
    styleUrls: ["./submission-form.component.scss"],
    providers: [SubmissionService],
})
export class SubmissionFormComponent implements OnInit {
    event: string
    games: GameSubmission[] = []
    maxGames: number = 5
    isDebouncing: boolean = false
    areSubmissionsOpen: boolean
    submissionsCloseDate: Date
    @ViewChild("stepper") stepper: any
    @ViewChild("f") form: any
    @Input() availability: string
    @Input() isRemote: boolean
    @Input() uploadBandwidth: string

    constructor(
        private auth: AuthenticationService,
        private submissionService: SubmissionService,
        private speedrunEventService: SpeedrunEventService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        const userId = this.auth.getUserInfo()._id
        this.speedrunEventService
            .getCurrentSpeedrunEvent()
            .subscribe((srEvent: SpeedrunEvent) => {
                this.event = srEvent.name
                this.areSubmissionsOpen = srEvent.areGameSubmissionsOpen
                this.submissionsCloseDate = new Date(
                    srEvent.dates.games.submissionsClose
                )

                this.submissionService
                    .getSubmissionsForUser(userId, srEvent._id)
                    .map((data: GameSubmissionResponse) => data.docs)
                    .subscribe((data: GameSubmission[]) => {
                        this.games = data
                        if (data.length > 0) {
                            this.availability = data[0].availability
                            this.isRemote = data[0].isRemote
                            if (
                                this.isRemote ||
                                (data[0].uploadBandwidth != "N/A" &&
                                    data[0].uploadBandwidth)
                            ) {
                                this.uploadBandwidth = data[0].uploadBandwidth
                            }
                        }
                    })
            })
    }

    addGame() {
        const userId = this.auth.getUserInfo()._id
        this.games.push({
            runner: userId,
            availability: this.availability,
            isRemote: this.isRemote,
            uploadBandwidth: this.uploadBandwidth,
            categories: [{}],
        } as GameSubmission)
    }

    removeGame(index: number) {
        const len = this.games.length
        if (len === 0) {
            return false
        }

        let game = this.games[index]

        const dialogRef = this.dialog.open(
            SubmissionConfirmationDialogComponent,
            {
                width: "800px",
                data: { game: game.name || "New Game" },
            }
        )

        dialogRef.afterClosed().subscribe((shouldRemove: boolean) => {
            if (shouldRemove) {
                // Remove submission from database
                const gameId = game._id
                if (gameId) {
                    this.submissionService.deleteSubmission(gameId).subscribe(
                        (res: any) => {
                            game = this.games.splice(index, 1)[0]
                            this.snackBar.open("Submission deleted", "", {
                                duration: 5000,
                                panelClass: ["snack-success", "no-action"],
                            })
                        },
                        (err: any) => {
                            this.snackBar.open(
                                "Something went wrong... submission not deleted",
                                "",
                                {
                                    duration: 5000,
                                    panelClass: ["snack-warn", "no-action"],
                                }
                            )
                        }
                    )
                }
            }
        })
    }

    submitGame(game: GameSubmission, form: any, buttons: MatButton[]) {
        if (!this.form.valid || !form.valid || this.isDebouncing) {
            if (!this.form.valid) {
                Object.values(this.form.controls).forEach(
                    (control: FormControl) => {
                        control.markAsTouched()
                    }
                )
            }
            return false
        }

        // Debounce buttons
        this.isDebouncing = true
        buttons.forEach((btn: MatButton) => (btn.disabled = true))
        if (game.runner.hasOwnProperty("_id")) {
            game.runner = (<RunnerData>game.runner)._id
        }
        game.public = false

        // Update supplementary information, if applicable
        if (
            this.availability !== game.availability ||
            this.isRemote !== game.isRemote ||
            (this.uploadBandwidth !== game.uploadBandwidth &&
                game.uploadBandwidth !== "N/A")
        ) {
            game.availability = this.availability
            game.isRemote = this.isRemote
            game.uploadBandwidth = this.uploadBandwidth || "N/A"
        }
        if (game._id) {
            // PUT
            this.submissionService.editSubmission(game).subscribe(
                (res: any) => {
                    this.isDebouncing = false
                    buttons.forEach((btn: MatButton) => (btn.disabled = false))
                    this.snackBar.open("Submission saved!", "", {
                        duration: 5000,
                        panelClass: ["snack-success", "no-action"],
                    })
                },
                (err: any) => {
                    this.isDebouncing = false
                    buttons.forEach((btn: MatButton) => (btn.disabled = false))
                    this.snackBar.open(
                        "Failed to update submission. Check the time, are game submissions closed?",
                        "",
                        {
                            duration: 5000,
                            panelClass: ["snack-warn", "no-action"],
                        }
                    )
                }
            )
        } else {
            // POST
            this.submissionService.createSubmission(game).subscribe(
                (res: any) => {
                    this.isDebouncing = false
                    buttons.forEach((btn: MatButton) => (btn.disabled = false))
                    this.snackBar.open("Submission saved!", "", {
                        duration: 5000,
                        panelClass: ["snack-success", "no-action"],
                    })
                    // Set the proper id for the submission, now that the database has generated one
                    game._id = res.data._id
                },
                (err: any) => {
                    this.isDebouncing = false
                    buttons.forEach((btn: MatButton) => (btn.disabled = false))
                    this.snackBar.open(
                        "Failed to create submission. Check the time, are game submissions closed?",
                        "",
                        {
                            duration: 5000,
                            panelClass: ["snack-warn", "no-action"],
                        }
                    )
                }
            )
        }
    }

    resetStepper() {
        this.stepper.reset()
        this.games = [{ categories: [{}] } as GameSubmission]
    }

    getObservableOfGames() {
        return of(this.games)
    }
}

export interface DialogData {
    game: string
    body?: string
}

@Component({
    selector: "app-submission-confirmation-dialog",
    templateUrl: "submission-confirmation-dialog.html",
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
