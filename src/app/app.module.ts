import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
	MatButtonModule,
	MatCardModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatToolbarModule
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { AppRoutingModule } from './/app-routing.module'
import { AppComponent } from './app.component'
import { AuthGuardService } from './auth-guard.service'
import { AuthenticationService } from './authentication.service'
import { CategorySubmissionComponent } from './category-submission/category-submission.component'
import { EventHomeComponent } from './event-home/event-home.component'
import { EventRulesComponent } from './event-rules/event-rules.component'
import { EventSweepstakesComponent } from './event-sweepstakes/event-sweepstakes.component'
import { FooterComponent } from './footer/footer.component'
import { GameSubmissionComponent } from './game-submission/game-submission.component'
import { LoginComponent } from './login/login.component'
import { MoneifyPipe } from './moneify.pipe'
import { NavbarComponent } from './navbar/navbar.component'
import { ProfileComponent } from './profile/profile.component'
import { RoleGuardService } from './role-guard.service'
import { SignupComponent } from './signup/signup.component'
import { SubmissionFormComponent } from './submission-form/submission-form.component'
import { SubmissionListComponent } from './submission-list/submission-list.component'
import { TimeRangeValidatorDirective } from './time-range.directive'
import { UserListComponent } from './user-list/user-list.component'
import { UserService } from './user.service'
import { VerifyPageComponent } from './verify-page/verify-page.component';
import { IdToUsernamePipe } from './id-to-username.pipe';
import { TimeToStringPipe } from './time-to-string.pipe';
import { SubmissionsListPageComponent } from './submissions-list-page/submissions-list-page.component'


@NgModule({
	declarations: [
		AppComponent,
		EventHomeComponent,
		MoneifyPipe,
		EventRulesComponent,
		EventSweepstakesComponent,
		UserListComponent,
		LoginComponent,
		SignupComponent,
		ProfileComponent,
		SubmissionListComponent,
		CategorySubmissionComponent,
		GameSubmissionComponent,
		TimeRangeValidatorDirective,
		NavbarComponent,
		FooterComponent,
		SubmissionFormComponent,
		VerifyPageComponent,
		IdToUsernamePipe,
		TimeToStringPipe,
		SubmissionsListPageComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatStepperModule,
		MatSortModule,
		MatTableModule,
		MatToolbarModule
	],
	providers: [
		AuthGuardService,
		AuthenticationService,
		RoleGuardService,
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
