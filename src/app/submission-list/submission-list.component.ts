import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core"
import {
    MatButton,
    MatDialog,
    MatPaginator,
    MatSnackBar,
    MatSort,
    MatTable,
    MatTableDataSource,
    PageEvent,
} from "@angular/material"
import { Router } from "@angular/router"
import { Observable } from "rxjs/Observable"
import { merge } from "rxjs/observable/merge"
import { of as observableOf } from "rxjs/observable/of"
import { catchError } from "rxjs/operators/catchError"
import { map } from "rxjs/operators/map"
import { startWith } from "rxjs/operators/startWith"
import { switchMap } from "rxjs/operators/switchMap"

import { AuthenticationService } from "../authentication.service"
import { SpeedrunEvent, SpeedrunEventService } from "../speedrun-event.service"
import { SubmissionConfirmationDialogComponent } from "../submission-form/submission-form.component"
import {
    GameSubmission,
    GameSubmissionResponse,
    SubmissionService,
} from "../submission.service"

@Component({
    selector: "app-submission-list",
    templateUrl: "./submission-list.component.html",
    styleUrls: ["./submission-list.component.scss"],
    providers: [SubmissionService],
})
export class SubmissionListComponent implements OnInit {
    @Input() columnsToDisplay: string[] = [
        "name",
        "console",
        "description",
        "proscons",
        "incentives",
        "categories",
    ]
    @Input() initialPageSize: number = 10
    @Input() dataSource: MatTableDataSource<GameSubmission> =
        new MatTableDataSource<GameSubmission>()
    @Input() speedrunEventId: string
    @Input() showRunner: boolean = true
    @Input() showPagination: boolean = true
    @Input() showFilter: boolean = true
    @Input() showControls: boolean = false
    @Input() showSelections: boolean = false
    @Input() showVisibility: boolean = false
    @Input() set filter(f: string) {
        this.applyFilter(f)
    }
    @Input() onlyShowAccepted: boolean = false

    resultsLength: number = 0
    isLoadingResults: boolean = false
    hasSubmissionsRole: boolean = false
    selectionQuery: string

    @ViewChild(MatTable) table: any
    @ViewChild(MatPaginator) paginator: MatPaginator
    @ViewChild(MatSort) sort: MatSort

    paginators: MatPaginator[]
    pageChangedEmitter: EventEmitter<number> = new EventEmitter<number>()

    constructor(
        public auth: AuthenticationService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private speedrunEventService: SpeedrunEventService,
        private submissionService: SubmissionService,
        private router: Router
    ) {}

    ngOnInit() {
        const user = this.auth.getUserInfo()
        // TODO: Get this url logic out of this component. Replace with more configurable options (see #15)
        if (
            (user &&
                user.roles.includes("submissions") &&
                this.router.url !== "/submissions/create" &&
                this.router.url !== "/games") ||
            this.router.url === "/profile"
        ) {
            this.columnsToDisplay.push("extras")
            this.columnsToDisplay.push("public")
            if (this.showRunner && user && user.roles.includes("submissions")) {
                this.hasSubmissionsRole = true
                if (
                    this.router.url !== "/profile" &&
                    this.router.url !== "/games"
                ) {
                    this.columnsToDisplay.push("controls")
                    this.showControls = true
                }
            }
            this.initialPageSize = 5000
        }

        // TODO: This was an attempt to get tables to not break responsiveness
        // at small screen sizes. Need to look further into better methods.

        // if (this.router.url === "/profile") {
        //     const descIndex = this.columnsToDisplay.indexOf("description")
        //     this.columnsToDisplay.splice(descIndex, 3)
        //     const extraIndex = this.columnsToDisplay.indexOf("extras")
        //     this.columnsToDisplay.splice(extraIndex, 1)
        // }

        if (this.showRunner) {
            this.columnsToDisplay.unshift("runner")
        }

        if (this.filter) {
            this.applyFilter(this.filter)
        }
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))

        if (this.dataSource.data !== undefined) {
            this.selectionQuery = this.onlyShowAccepted ? "accept+bonus" : ""

            if (!this.speedrunEventId) {
                this.speedrunEventService
                    .getCurrentSpeedrunEvent()
                    .subscribe((srEvent: SpeedrunEvent) => {
                        this.speedrunEventId = srEvent._id

                        this.setupTable()
                    })
            } else {
                this.setupTable()
            }
        } else {
            this.isLoadingResults = false
        }
    }

    setupTable() {
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true
                    return this.submissionService.getSubmissions(
                        this.selectionQuery,
                        this.sort.active,
                        this.sort.direction,
                        this.paginator.pageSize || this.initialPageSize,
                        this.paginator.pageIndex,
                        this.speedrunEventId
                    )
                }),
                map((data: GameSubmissionResponse) => {
                    this.isLoadingResults = false
                    this.resultsLength = data.total

                    return data.docs
                }),
                catchError(() => {
                    this.isLoadingResults = false
                    // TODO: Display an error message on the table
                    return observableOf([])
                })
            )
            .subscribe((data: GameSubmission[]) => {
                this.dataSource.data = data
            })
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim()
        filterValue = filterValue.toLowerCase()
        if (filterValue.includes("selection:")) {
            if (
                filterValue.includes("accept") ||
                filterValue.includes("backup") ||
                filterValue.includes("bonus") ||
                filterValue.includes("decline")
            ) {
                this.selectionQuery = filterValue.split(":")[1]
                this.paginator.page.emit()
                this.dataSource.filter = ""
            }
        } else if (this.selectionQuery) {
            this.selectionQuery = ""
            this.paginator.page.emit()
            this.dataSource.filter = filterValue
        } else {
            this.dataSource.filter = filterValue
        }
    }

    markSubmission(
        event: any,
        submission: GameSubmission,
        status: string,
        catIndex?: number,
        statusComment?: string
    ) {
        event.stopPropagation()
        const button: HTMLButtonElement = event.target.closest("button")
        const elems = button.closest("fieldset").getElementsByTagName("button")
        for (let i = 0; i < elems.length; i++) {
            elems.item(i).disabled = true
        }
        button.classList.add("showSpinner")
        this.submissionService
            .markSubmission(submission, status, catIndex, statusComment)
            .subscribe(
                (res: any) => {
                    for (let i = 0; i < elems.length; i++) {
                        elems.item(i).disabled = false
                    }
                    button.classList.remove("showSpinner")
                    this.snackBar.open(`Successfully marked ${status}!`, "", {
                        duration: 5000,
                        panelClass: ["snack-success", "no-action"],
                    })
                },
                (err: any) => {
                    for (let i = 0; i < elems.length; i++) {
                        elems.item(i).disabled = false
                    }
                    button.classList.remove("showSpinner")
                    this.snackBar.open(`Failed to mark ${status}!`, "", {
                        duration: 5000,
                        panelClass: ["snack-warn", "no-action"],
                    })
                    console.error(`FAILED TO MARK ${status.toUpperCase()}`)
                }
            )
    }

    deleteSubmission(submission: GameSubmission) {
        const dialogRef = this.dialog.open(
            SubmissionConfirmationDialogComponent,
            {
                width: "800px",
                data: {
                    game: submission.name || "TITLENOTFOUND",
                    body: "WARNING: This action is irreversable! Make sure you selected the correct submission before proceeding.",
                },
            }
        )

        dialogRef.afterClosed().subscribe((shouldRemove: boolean) => {
            if (shouldRemove) {
                // Remove submission from database
                const gameId = submission._id
                if (gameId) {
                    this.submissionService.deleteSubmission(gameId).subscribe(
                        (res: any) => {
                            this.snackBar.open(
                                "Successfully deleted submission",
                                "",
                                {
                                    duration: 5000,
                                    panelClass: ["snack-success", "no-action"],
                                }
                            )
                            // Refresh the table
                            this.paginator.page.emit()
                        },
                        (err: any) => {
                            this.snackBar.open(
                                "Failed to delete submission",
                                "",
                                {
                                    duration: 5000,
                                    panelClass: ["snack-warn", "no-action"],
                                }
                            )
                            console.error("FAILED TO DELETE SUBMISSION")
                        }
                    )
                }
            }
        })
    }

    isRowCollapsible(row: GameSubmission) {
        return (
            (row.description &&
                row.description.length > 100 + 200 * row.categories.length) ||
            (row.pros && row.pros.length > 100 + 50 * row.categories.length) ||
            (row.cons && row.cons.length > 100 + 50 * row.categories.length) ||
            (row.incentives &&
                row.incentives.length > 100 + 200 * row.categories.length) ||
            (row.categories &&
                row.categories.some(
                    (cat: any) =>
                        cat.description && cat.description.length > 100
                ))
        )
    }
}
