import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'

import { User } from './user'

export interface TokenUserInfo {
	_id: string
	username: string
	exp: number
	iat: number
}

interface TokenResponse {
	token: string
}

export interface TokenPayload {
	username: string
	password: string
	firstName?: string
	lastName?: string
	email?: string
}

@Injectable()
export class AuthenticationService {
	redirectUrl: string
	private token: string

	constructor(private http: HttpClient, private router: Router) { }

	public logout(): void {
		this.token = ''
		window.localStorage.removeItem('jwtToken')
		this.router.navigateByUrl('/')
	}

	public getUserInfo(): TokenUserInfo {
		const token = this.getToken()
		if (token) {
			let payload = token.split('.')[1]
			payload = window.atob(payload)
			return JSON.parse(payload)
		}

		return null
	}

	public isLoggedIn(): boolean {
		const user = this.getUserInfo()
		if (user) {
			return user.exp > Date.now() / 1000
		}

		return false
	}

	public register(user: TokenPayload): Observable<any> {
		return this.request('post', 'signup', user)
	}

	public login(user: TokenPayload): Observable<any> {
		return this.request('post', 'login', user)
	}

	public profile(): Observable<User> {
		return this.request('get', 'profile')
	}

	private saveToken(token: string): void {
		localStorage.setItem('jwtToken', token)
		this.token = token
	}

	private getToken(): string {
		if (!this.token) {
			this.token = localStorage.getItem('jwtToken')
		}

		return this.token
	}

	private request(method: 'post'|'get', type: 'login'|'signup'|'profile', user?: TokenPayload): Observable<any> {
		let base

		if (method === 'post') {
			base = this.http.post(`http://localhost:3000/api/users/${type === 'signup' ? '' : type}`, user)
		} else {
			base = this.http.get(`http://localhost:3000/api/users/${type}`, {
				headers: { Authorization: `Bearer ${this.getToken()}` }
			})
		}

		const request = base.pipe(
			map((data: TokenResponse) => {
				if (data.token) {
					this.saveToken(data.token)
				}

				return data
			})
		)

		return request
	}
}
