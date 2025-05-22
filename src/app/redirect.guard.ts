import { Injectable } from "@angular/core"
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from "@angular/router"
import { Observable } from "rxjs/Observable"

@Injectable()
export class RedirectGuard implements CanActivate {
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        window.location.href = next.data.url
        return true
    }
}
