import { Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material'
import { Router } from '@angular/router'
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
	columnsToDisplay: string[] = ['runner', 'name', 'console', 'description', 'pros', 'cons', 'categories', 'public']
	dataSource: MatTableDataSource<GameSubmission> = new MatTableDataSource<GameSubmission>()

	resultsLength: number = 0
	isLoadingResults: boolean = true

	@ViewChild(MatTable) table: any
	@ViewChild(MatPaginator) paginator: MatPaginator
	@ViewChild(MatSort) sort: MatSort

	constructor(
		public auth: AuthenticationService,
		private submissionService: SubmissionService,
		private router: Router
	) { }

	ngOnInit() {
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true
					return this.submissionService.getSubmissions(
						this.sort.active, this.sort.direction, this.paginator.pageSize, this.paginator.pageIndex)
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

}
