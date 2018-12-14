import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { AppRoutingModule } from './/app-routing.module'
import { AppComponent } from './app.component'
import { AuthGuardService } from './auth-guard.service'
import { AuthenticationService } from './authentication.service'
import { EventHomeComponent } from './event-home/event-home.component'
import { EventRulesComponent } from './event-rules/event-rules.component'
import { EventSweepstakesComponent } from './event-sweepstakes/event-sweepstakes.component'
import { LoginComponent } from './login/login.component'
import { MoneifyPipe } from './moneify.pipe'
import { ProfileComponent } from './profile/profile.component'
import { SignupComponent } from './signup/signup.component'
import { UserListComponent } from './user-list/user-list.component'


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
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule
	],
	providers: [
		AuthGuardService,
		AuthenticationService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
