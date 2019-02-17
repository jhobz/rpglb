import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators/map'

import { environment } from '../environments/environment'

import { User } from './user'

export interface TokenUserInfo {
	_id: string
	username: string
	roles: string[]
	exp: number
	iat: number
}

interface TokenResponse {
	token: string
}

export interface TokenPayload {
	username: string
	password: string
	confirm?: string
	firstName?: string
	lastName?: string
	email?: string
}

export interface PasswordData {
	username: string
	current: string
	'new': string
	confirm: string
}

@Injectable()
export class AuthenticationService {
	apiUrl: string = environment.apiUrl
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

	public changePassword(payload: PasswordData): Observable<any> {
		return this.http.post(`${this.apiUrl}/users/changePassword`, payload, {
			headers: this.generateAuthHeader()
		})
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

	// TODO: Move this to UserService
	public profile(): Observable<User> {
		return this.request('get', 'profile')
			.map((res: any) => res.data)
	}

	public generateAuthHeader(): HttpHeaders {
		return new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` })
	}

	public updateToken(token: string): void {
		this.saveToken(token)
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
			base = this.http.post(`${this.apiUrl}/users/${type === 'signup' ? '' : type}`, user)
		} else {
			base = this.http.get(`${this.apiUrl}/users/${type}`, {
				headers: this.generateAuthHeader()
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
