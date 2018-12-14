import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuardService } from './auth-guard.service'
import { EventHomeComponent } from './event-home/event-home.component'
import { EventRulesComponent } from './event-rules/event-rules.component'
import { EventSweepstakesComponent } from './event-sweepstakes/event-sweepstakes.component'
import { LoginComponent } from './login/login.component'
import { ProfileComponent } from './profile/profile.component'
import { SignupComponent } from './signup/signup.component'
import { UserListComponent } from './user-list/user-list.component'

const routes: Routes = [
	{ path: '', redirectTo: '/event', pathMatch: 'full' },
	{ path: 'event', component: EventHomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'rules', component: EventRulesComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'sweepstakes', component: EventSweepstakesComponent },
	{ path: 'users', component: UserListComponent }
]

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
