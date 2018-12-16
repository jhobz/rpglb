import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'

import { AuthenticationService } from './authentication.service'

@Injectable()
export class RoleGuardService implements CanActivate {

	constructor(private auth: AuthenticationService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const user = this.auth.getUserInfo()

		if (user.roles.includes(route.data.role)) {
			return true
		}

		// TODO: Fail gracefully
		return false
	}

}
