import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { environment } from '../environments/environment'

import { AuthenticationService } from './authentication.service'
import { GameSubmission } from './submission.service'
import { User } from './user'

export interface SpeedrunEvent {
	_id?: string,
	name: string,
	shortname?: string,
	cause?: object,
	trackerId?: string,
	active: boolean,
	state: 'pre'|'live'|'post',
	areGameSubmissionsOpen?: boolean,
	arePrizeSubmissionsOpen?: boolean,
	areVolunteerSubmissionsOpen?: boolean,
	isGamesListPublic?: boolean,
	isRegistrationOpen?: boolean,
	registeredUsersCount?: number,
	maxRegisteredUsers?: number,
	registrationCost?: number,
	gameSubmissions?: GameSubmission[],
	volunteerSubmissions?: any,
	registeredUsers?: User[],
	admins?: User[]
	dates?: {
		games: {
			submissionsOpen: string,
			submissionsClose: string,
			listRelease: string,
			scheduleRelease: string
		},
		registration: {
			open: string,
			close: string,
			refundDeadline: string
		},
		prizes: {
			submissionsOpen: string,
			submissionsClose: string,
		},
		volunteers: {
			applicationsOpen: string,
			applicationsClose: string,
			scheduleRelease: string
		},
		event: {
			start: string,
			end: string
		},
		misc?: {
			covidPolicy?: string
		}
	}
}

@Injectable()
export class SpeedrunEventService {
	private apiUrl: string = `${environment.apiUrl}/events`

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	getCurrentSpeedrunEvent(): Observable<SpeedrunEvent> {
		return this.http.get(`${this.apiUrl}/active`)
			.map((res: any) => {
				return res.data as SpeedrunEvent
			})
	}

	editSpeedrunEvent(srEvent: SpeedrunEvent): Observable<SpeedrunEvent> {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.put(`${this.apiUrl}`, srEvent, options)
			.map((res: any) => {
				return res.data as SpeedrunEvent
			})
	}
}
