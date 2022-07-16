import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'

import { environment } from '../environments/environment'

import { AuthenticationService } from './authentication.service'

export interface RunnerData {
	_id: string,
	username: string
}

export interface GameCategory {
	_id?: string
	_uid?: number
	name: string
	estimateTimeString?: string
	estimate: number
	description: string
	selectionStatus: number
	selectionComment?: string
	video: string
}

export interface GameSubmission {
	_id?: string
	runner: string|RunnerData
	name: string
	console: string
	description: string
	incentives: string
	pros: string
	cons: string
	public: boolean
	categories: GameCategory[]
	availability: string
	isRemote: boolean
	uploadBandwidth: string
	techNotes?: string
	speedrunEvent?: string
}

export interface GameSubmissionResponse {
	docs: GameSubmission[]
	total: number
	limit: number
	page: number
	pages: number
}

@Injectable()
export class SubmissionService {
	static SELECTION_STATUS: object = {
		DECLINE: 0,
		ACCEPT: 1,
		BACKUP: 2,
		BONUS: 3
	}

	private apiUrl: string = `${environment.apiUrl}/submissions`

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	// TODO: Make PaginationResponse class to replace "any" as the repsonse type

	createSubmission(submission: GameSubmission): Observable<any> {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.post(this.apiUrl, submission, options)
	}

	getSubmissionsForUser(userId: string, speedrunEventId?: string): Observable<GameSubmissionResponse> {
		const options = {
			headers: this.auth.generateAuthHeader(),
			params: new HttpParams()
				.set('user', userId)
		}

		if (speedrunEventId) {
			// HttpParams.set() is immutable; it returns a new object
			options.params = options.params.set('speedrunEvent', speedrunEventId)
		}

		return this.http.get<any>(this.apiUrl, options)
			.map((data: any) => data.data as GameSubmissionResponse)
	}

	getSubmissions(
		selectionStatus?: string,
		sort: string = 'name',
		order: string = 'asc',
		limit: number = 10,
		page: number = 0,
		speedrunEventId?: string): Observable<GameSubmissionResponse> {
		const options = {
			headers: this.auth.generateAuthHeader(),
			params: new HttpParams()
				.set('selection', selectionStatus)
				.set('sort', sort)
				.set('order', order)
				.set('limit', `${limit}`)
				.set('page', `${page + 1}`)
		}

		if (speedrunEventId) {
			// HttpParams.set() is immutable; it returns a new object
			options.params = options.params.set('speedrunEvent', speedrunEventId)
		}

		return this.http.get<any>(this.apiUrl, options)
			.map((data: any) => data.data as GameSubmissionResponse)
	}

	editSubmission(submission: GameSubmission): Observable<any> {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.put(this.apiUrl, submission, options)
	}

	deleteSubmission(id: string): Observable<any> {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.delete(`${this.apiUrl}/${id}`, options)
	}

	markSubmission(
		submission: GameSubmission,
		status: string,
		catIndex?: number,
		statusComment?: string): Observable<any> {
		switch (status) {
			case 'public':
				submission.public = true
				break
			case 'private':
				submission.public = false
				break
			case 'accept':
			case 'backup':
			case 'bonus':
			case 'decline':
				if (catIndex === undefined) {
					throw new Error('catIndex is not specified')
				}
				const statusCode = SubmissionService.SELECTION_STATUS[status.toUpperCase()]
				submission.categories[catIndex].selectionStatus = statusCode
				if (statusComment !== undefined) {
					submission.categories[catIndex].selectionComment = statusComment
				}
				break
		}

		return this.editSubmission(submission)
	}

	private handleError(error: any): Promise<any> {
		// TODO: Put some proper error handling in later
		console.error('An error occurred', error)
		return Promise.reject(error.message || error)
	}

}
