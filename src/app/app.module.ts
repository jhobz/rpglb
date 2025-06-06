import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
} from "@angular/material"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from ".//app-routing.module"
import { AppComponent } from "./app.component"
import { AuthGuardService } from "./auth-guard.service"
import { AuthenticationService } from "./authentication.service"
import { BlogComponent } from "./blog/blog.component"
import { CategorySubmissionComponent } from "./category-submission/category-submission.component"
import { DonateHeaderComponent } from "./donate-header/donate-header.component"
import { EventHomeComponent } from "./event-home/event-home.component"
import { EventRulesComponent } from "./event-rules/event-rules.component"
import { EventSweepstakesComponent } from "./event-sweepstakes/event-sweepstakes.component"
import { FooterComponent } from "./footer/footer.component"
import { GameSubmissionComponent } from "./game-submission/game-submission.component"
import { GamesListPageComponent } from "./games-list-page/games-list-page.component"
import { LoginComponent } from "./login/login.component"
import { MoneifyPipe } from "./moneify.pipe"
import { NavbarComponent } from "./navbar/navbar.component"
import { PasswordResetPageComponent } from "./password-reset-page/password-reset-page.component"
import { PaymentService } from "./payment.service"
import { PreEventHomePageComponent } from "./pre-event-home-page/pre-event-home-page.component"
import { ProfileComponent } from "./profile/profile.component"
import { RegistrationPageComponent } from "./registration-page/registration-page.component"
import { RoleGuardService } from "./role-guard.service"
import { SignupComponent } from "./signup/signup.component"
import { SpeedrunEventService } from "./speedrun-event.service"
import {
    SubmissionConfirmationDialogComponent,
    SubmissionFormComponent,
} from "./submission-form/submission-form.component"
import { SubmissionListComponent } from "./submission-list/submission-list.component"
import { SubmissionsListPageComponent } from "./submissions-list-page/submissions-list-page.component"
import { TimeRangeValidatorDirective } from "./time-range.directive"
import { TimeToStringPipe } from "./time-to-string.pipe"
import { TruncatePipe } from "./truncate.pipe"
import { UserService } from "./user.service"
import { VerifyPageComponent } from "./verify-page/verify-page.component"
import { ContactComponent } from "./contact/contact.component"
import { TimelineComponent } from "./timeline/timeline.component"
import { VolunteerPageComponent } from "./volunteer-page/volunteer-page.component"
import { HealthPolicyComponent } from "./health-policy/health-policy.component"
import { AdminPageComponent } from "./admin-page/admin-page.component"
import { RunnerGuideComponent } from "./runner-guide/runner-guide.component"
import { SpeedrunEventGuard } from "./speedrun-event.guard"
import { SubmissionGuidelinesPageComponent } from "./submission-guidelines-page/submission-guidelines-page.component"
import { SanitizedHtmlPipe } from "./sanitized-html.pipe"
import { RedirectGuard } from "./redirect.guard"

@NgModule({
    declarations: [
        AppComponent,
        EventHomeComponent,
        MoneifyPipe,
        EventRulesComponent,
        EventSweepstakesComponent,
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
        SubmissionConfirmationDialogComponent,
        VerifyPageComponent,
        TimeToStringPipe,
        SubmissionsListPageComponent,
        PreEventHomePageComponent,
        TruncatePipe,
        GamesListPageComponent,
        RegistrationPageComponent,
        PasswordResetPageComponent,
        DonateHeaderComponent,
        BlogComponent,
        ContactComponent,
        TimelineComponent,
        VolunteerPageComponent,
        HealthPolicyComponent,
        AdminPageComponent,
        RunnerGuideComponent,
        SubmissionGuidelinesPageComponent,
        SanitizedHtmlPipe,
    ],
    entryComponents: [SubmissionConfirmationDialogComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatStepperModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
    ],
    providers: [
        AuthGuardService,
        AuthenticationService,
        PaymentService,
        RedirectGuard,
        RoleGuardService,
        SpeedrunEventGuard,
        SpeedrunEventService,
        UserService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
