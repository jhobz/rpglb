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
	private apiUrl: string = `${environment.apiUrl}/submissions`

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	// TODO: Make PaginationResponse class to replace "any" as the repsonse type

	createSubmission(submission: GameSubmission): Observable<any> {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.post(this.apiUrl, submission, options)
	}

	getSubmissionsForUser(userId: string): Observable<GameSubmissionResponse> {
		const options = {
			headers: this.auth.generateAuthHeader(),
			params: new HttpParams()
				.set('user', userId)
		}

		return this.http.get<any>(this.apiUrl, options)
			.map((data: any) => data.data as GameSubmissionResponse)
	}

	getSubmissions(
		sort: string = 'name',
		order: string = 'asc',
		limit: number = 10,
		page: number = 0): Observable<GameSubmissionResponse> {
		const options = {
			headers: this.auth.generateAuthHeader(),
			params: new HttpParams()
				.set('sort', sort)
				.set('order', order)
				.set('limit', `${limit}`)
				.set('page', `${page + 1}`)
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

	markSubmission(submission: GameSubmission, status: string): Observable<any> {
		switch (status) {
			case 'public':
				submission.public = true
				break
			case 'private':
				submission.public = false
				break
			case 'accept':
			case 'backup':
			case 'reject':
				// TODO: Uncomment when selection is implemented
				// submission.selectionStatus = status
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
