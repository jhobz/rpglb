import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable'

import { User } from './user'

@Injectable()
export class UserService {
	private apiUrl: string = 'http://localhost:3000/api/users'

	constructor(private http: HttpClient) {
	}

	// TODO: Make PaginationResponse class to replace "any" as the repsonse type

	createUser(user: User): Observable<any> {
		return this.http.post(this.apiUrl, user)
	}

	getUsers(): Observable<User[]> {
		const options = {
			// The default empty string is necessary here or HttpClient throws a hissy fit
			headers: new HttpHeaders({ 'Authorization': localStorage.getItem('jwtToken') || '' })
		}
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

	// TODO: make a proper class for `loginData`
	loginUser(loginData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/login`, loginData)
	}

	private handleError(error: any): Promise<any> {
		// TODO: Put some proper error handling in later
		console.error('An error occurred', error)
		return Promise.reject(error.message || error)
	}

}
