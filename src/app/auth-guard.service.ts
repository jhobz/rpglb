import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'

import { AuthenticationService } from './authentication.service'

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(private auth: AuthenticationService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.checkLogin(state.url)
	}

	checkLogin(url: string): boolean {
		if (this.auth.isLoggedIn()) {
			return true
		}

		this.auth.redirectUrl = url

		this.router.navigate(['login'])
		return false
	}

}
