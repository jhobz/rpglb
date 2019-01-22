import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core'
import { MatButton, MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, PageEvent } from '@angular/material'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { merge } from 'rxjs/observable/merge'
import { of as observableOf } from 'rxjs/observable/of'
import { catchError } from 'rxjs/operators/catchError'
import { map } from 'rxjs/operators/map'
import { startWith } from 'rxjs/operators/startWith'
import { switchMap } from 'rxjs/operators/switchMap'

import { AuthenticationService } from '../authentication.service'
import { GameSubmission, GameSubmissionResponse, SubmissionService } from '../submission.service'

@Component({
	selector: 'app-submission-list',
	templateUrl: './submission-list.component.html',
	styleUrls: ['./submission-list.component.css'],
	providers: [SubmissionService]
})
export class SubmissionListComponent implements OnInit {
	columnsToDisplay: string[] = ['name', 'console', 'description', 'pros', 'cons', 'incentives', 'categories']
	defaultPageSize: number = 10
	@Input() dataSource: MatTableDataSource<GameSubmission> = new MatTableDataSource<GameSubmission>()
	@Input() showRunner: boolean = true
	@Input() showPagination: boolean = true
	@Input() showFilter: boolean = true
	@Input() filter: string

	resultsLength: number = 0
	isLoadingResults: boolean = true

	@ViewChild(MatTable) table: any
	@ViewChild('paginatorTop') paginatorTop: MatPaginator
	@ViewChild('paginatorBottom') paginatorBottom: MatPaginator
	@ViewChild(MatSort) sort: MatSort

	paginators: MatPaginator[]
	pageChangedEmitter: EventEmitter<number> = new EventEmitter<number>()

	constructor(
		public auth: AuthenticationService,
		private snackBar: MatSnackBar,
		private submissionService: SubmissionService,
		private router: Router
	) { }

	ngOnInit() {
		const user = this.auth.getUserInfo()
		if (user && user.roles.includes('submissions') || this.router.url === '/profile') {
			this.columnsToDisplay.push('public')
			if (this.showRunner) {
				this.columnsToDisplay.push('controls')
			}
			this.defaultPageSize = 5000
		}

		if (this.showRunner) {
			this.columnsToDisplay.unshift('runner')
		}

		if (this.filter) {
			this.applyFilter(this.filter)
		}
		this.paginators = [this.paginatorTop, this.paginatorBottom]
		this.sort.sortChange.subscribe(() => this.paginators.forEach((pag: MatPaginator) => pag.pageIndex = 0))

		merge(this.sort.sortChange, this.pageChangedEmitter)
				.pipe(
					startWith({}),
					switchMap(() => {
						this.isLoadingResults = true
						return this.submissionService.getSubmissions(
							this.sort.active, this.sort.direction, this.paginatorTop.pageSize, this.paginatorTop.pageIndex)
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
				).subscribe((data: GameSubmission[]) => {
					this.dataSource.data = data
				})
	}

	onPageChange(event: PageEvent) {
		for (const pag of this.paginators) {
			pag.pageIndex = event.pageIndex
			pag.pageSize = event.pageSize
		}
		this.pageChangedEmitter.emit(event.pageIndex)
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim()
		filterValue = filterValue.toLowerCase()
		this.dataSource.filter = filterValue
	}

	markSubmission(submission: GameSubmission, status: string, button: HTMLButtonElement) {
		const elems = button.closest('fieldset').getElementsByTagName('button')
		for (let i = 0; i < elems.length; i++) {
			elems.item(i).disabled = true
		}
		button.classList.add('showSpinner')
		this.submissionService.markSubmission(submission, status)
			.subscribe(
				(res: any) => {
					for (let i = 0; i < elems.length; i++) {
						elems.item(i).disabled = false
					}
					button.classList.remove('showSpinner')
					this.snackBar.open(`Successfully marked ${status}!`, '', {
						duration: 5000,
						panelClass: ['snack-success', 'no-action']
					})
				},
				(err: any) => {
					for (let i = 0; i < elems.length; i++) {
						elems.item(i).disabled = false
					}
					button.classList.remove('showSpinner')
					this.snackBar.open(`Failed to mark ${status}!`, '', {
						duration: 5000,
						panelClass: ['snack-warn', 'no-action']
					})
					console.error('FAILED TO MARK PUBLIC')
				})
	}

}
