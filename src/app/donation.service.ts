import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { SpeedrunEvent } from './speedrun-event';
import { TrackerJson } from './tracker-json';

@Injectable()
export class DonationService {
	// TODO: Change to local url during production
	private trackerUrl: string = 'https://rpglimitbreak.com/tracker/';

	constructor(private http: HttpClient) {
	}

	getTotalForEvent(event: SpeedrunEvent): Observable<string> {
		return this.http.get(this.trackerUrl + event.trackerId + '?json')
			.map((data: TrackerJson) => {
				return data.agg.amount;
			});
	}

	getGoalForEvent(event: SpeedrunEvent): Observable<string> {
		return this.http.get(this.trackerUrl + event.trackerId + '?json')
			.map((data: TrackerJson) => {
				return data.agg.target;
			});
	}

}
