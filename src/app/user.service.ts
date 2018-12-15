import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'

import { AuthenticationService } from './authentication.service'
import { User } from './user'

@Injectable()
export class UserService {
	private apiUrl: string = 'http://localhost:3000/api/users'

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	// TODO: Make PaginationResponse class to replace "any" as the repsonse type

	createUser(user: User): Observable<any> {
		return this.http.post(this.apiUrl, user)
	}

	getUsers(): Observable<User[]> {
		const options = { headers: this.auth.generateAuthHeader() }

		return this.http.get(this.apiUrl, options)
			.map( (res: any) => {
				return res.data.docs as User[]
			} )
	}

	editUser(user: User): Observable<any> {
		return this.http.put(this.apiUrl, user)
	}

	deleteUser(id: string): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`)
	}

	private handleError(error: any): Promise<any> {
		// TODO: Put some proper error handling in later
		console.error('An error occurred', error)
		return Promise.reject(error.message || error)
	}

}
