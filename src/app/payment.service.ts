import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from '../environments/environment'

import { AuthenticationService } from './authentication.service'

@Injectable()
export class PaymentService {
	private apiUrl: string = `${environment.apiUrl}/payments`

	constructor(private auth: AuthenticationService, private http: HttpClient) { }

	processPayment(stripe: any, amount: number) {
		const options = { headers: this.auth.generateAuthHeader() }
		return this.http.post(this.apiUrl, {
			amount,
			token: stripe.id,
			email: stripe.email
		},                    options)
	}

}
