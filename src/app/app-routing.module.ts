import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AuthGuardService } from './auth-guard.service'
import { EventHomeComponent } from './event-home/event-home.component'
import { EventRulesComponent } from './event-rules/event-rules.component'
import { EventSweepstakesComponent } from './event-sweepstakes/event-sweepstakes.component'
import { LoginComponent } from './login/login.component'
import { PreEventHomePageComponent } from './pre-event-home-page/pre-event-home-page.component'
import { ProfileComponent } from './profile/profile.component'
import { RoleGuardService } from './role-guard.service'
import { SignupComponent } from './signup/signup.component'
import { SubmissionFormComponent } from './submission-form/submission-form.component'
import { SubmissionsListPageComponent } from './submissions-list-page/submissions-list-page.component'
import { UserListComponent } from './user-list/user-list.component'
import { VerifyPageComponent } from './verify-page/verify-page.component'

const routes: Routes = [
	{ path: '', redirectTo: '/pre', pathMatch: 'full' },
	{ path: 'event', component: EventHomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'rules', component: EventRulesComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
	{ path: 'pre', component: PreEventHomePageComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'submissions', component: SubmissionsListPageComponent },
	{ path: 'submissions/create', component: SubmissionFormComponent, canActivate: [AuthGuardService] },
	{ path: 'sweepstakes', component: EventSweepstakesComponent },
	// { path: 'users', component: UserListComponent },
	{ path: 'verify', component: VerifyPageComponent }
]

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
