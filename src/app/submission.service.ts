import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'

import { AuthenticationService } from './authentication.service'

interface GameCategory {
	name: string
	estimate: number
	description: string
	video: string
}

export interface GameSubmission {
	_id: string
	runner: string
	name: string
	console: string
	description: string
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
	private apiUrl: string = 'http://localhost:3000/api/submissions'

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	// TODO: Make PaginationResponse class to replace "any" as the repsonse type

	createSubmission(submission: GameSubmission): Observable<any> {
		return this.http.post(this.apiUrl, submission)
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
		return this.http.put(this.apiUrl, submission)
	}

	deleteSubmission(id: string): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`)
	}

	private handleError(error: any): Promise<any> {
		// TODO: Put some proper error handling in later
		console.error('An error occurred', error)
		return Promise.reject(error.message || error)
	}

}
