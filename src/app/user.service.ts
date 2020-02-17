import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { share } from 'rxjs/operators'

import { environment } from '../environments/environment'

import { AuthenticationService } from './authentication.service'
import { User } from './user'

@Injectable()
export class UserService {
	private apiUrl: string = `${environment.apiUrl}/users`

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

	resetPassword(id: string, token: string, password: string): Observable<any> {
		if (!token) {
			return of(false)
		}

		const obs = this.http.post(`${this.apiUrl}/reset`, {
			new: password,
			token: token,
			user: id,
		}).pipe(share())
		obs.subscribe((res: any) => {
			if (res.token) {
				this.auth.updateToken(res.token)
			}
		})

		return obs
	}

	sendPasswordResetEmail(email: string): Observable<any> {
		return this.http.post(`${this.apiUrl}/reset`, {
			email: email
		})
	}

	verifyUser(id: string, token: string): Observable<any> {
		if (!token) {
			return of(false)
		}
		const obs = this.http.post(`${this.apiUrl}/verify`, {
			token: token,
			user: id,
		}).pipe(share())
		obs.subscribe((res: any) => {
			if (res.token) {
				this.auth.updateToken(res.token)
			}
		},            (err: any) => { /* Error handling performed by component */ })

		return obs
	}

	sendVerificationEmail(id: string): Observable<any> {
		return this.http.post(`${this.apiUrl}/verify`, {
			user: id
		})
	}

	registerUser(): Observable<any> {
		const options = { headers: this.auth.generateAuthHeader() }
		const obs = this.http.post(`${this.apiUrl}/register`, { v: true }, options).pipe(share())
		obs.subscribe((res: any) => {
			this.auth.updateToken(res.token)
		})

		return obs
	}

}
