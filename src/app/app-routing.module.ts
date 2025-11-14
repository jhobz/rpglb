import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { AuthGuardService } from "./auth-guard.service"
import { BlogComponent } from "./blog/blog.component"
import { ContactComponent } from "./contact/contact.component"
import { HealthPolicyComponent } from "./health-policy/health-policy.component"
import { EventHomeComponent } from "./event-home/event-home.component"
import { EventRulesComponent } from "./event-rules/event-rules.component"
import { EventSweepstakesComponent } from "./event-sweepstakes/event-sweepstakes.component"
import { GamesListPageComponent } from "./games-list-page/games-list-page.component"
import { LoginComponent } from "./login/login.component"
import { PasswordResetPageComponent } from "./password-reset-page/password-reset-page.component"
import { PreEventHomePageComponent } from "./pre-event-home-page/pre-event-home-page.component"
import { ProfileComponent } from "./profile/profile.component"
import { RegistrationPageComponent } from "./registration-page/registration-page.component"
import { SignupComponent } from "./signup/signup.component"
import { SubmissionFormComponent } from "./submission-form/submission-form.component"
import { SubmissionsListPageComponent } from "./submissions-list-page/submissions-list-page.component"
import { VerifyPageComponent } from "./verify-page/verify-page.component"
import { VolunteerPageComponent } from "./volunteer-page/volunteer-page.component"
import { AdminPageComponent } from "./admin-page/admin-page.component"
import { RunnerGuideComponent } from "./runner-guide/runner-guide.component"
import { SpeedrunEventGuard } from "./speedrun-event.guard"
import { SubmissionGuidelinesPageComponent } from "./submission-guidelines-page/submission-guidelines-page.component"
import { SpeedrunEventResolver } from "./speedrun-event-resolver.service"
import { EmailTestPageComponent } from "./email-test-page/email-test-page.component"

const routes: Routes = [
    {
        path: "",
        component: PreEventHomePageComponent,
        pathMatch: "full",
        canActivate: [SpeedrunEventGuard],
        // TODO: Convert pages that need the SpeedrunEvent to use this resolver to get it
        resolve: {
            speedrunEvent: SpeedrunEventResolver,
        },
    },
    {
        path: "admin",
        component: AdminPageComponent,
        canActivate: [AuthGuardService],
    },
    { path: "news", component: BlogComponent },
    { path: "blog", component: BlogComponent },
    { path: "contact", component: ContactComponent },
    { path: "covid", component: HealthPolicyComponent },
    { path: "health", component: HealthPolicyComponent },
    {
        path: "emailtest",
        component: EmailTestPageComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: "event",
        component: EventHomeComponent,
        canActivate: [SpeedrunEventGuard],
    },
    { path: "games", component: GamesListPageComponent },
    { path: "login", component: LoginComponent },
    { path: "rules", component: EventRulesComponent },
    { path: "runner", component: RunnerGuideComponent },
    {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuardService],
    },
    { path: "pre", component: PreEventHomePageComponent },
    {
        path: "register",
        component: RegistrationPageComponent,
        canActivate: [AuthGuardService],
    },
    { path: "reset", component: PasswordResetPageComponent },
    { path: "signup", component: SignupComponent },
    { path: "submissions", component: SubmissionsListPageComponent },
    {
        path: "submissions/create",
        component: SubmissionFormComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: "submissions/guidelines",
        component: SubmissionGuidelinesPageComponent,
    },
    { path: "sweepstakes", component: EventSweepstakesComponent },
    { path: "verify", component: VerifyPageComponent },
    { path: "volunteer", component: VolunteerPageComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [SpeedrunEventResolver],
})
export class AppRoutingModule {}
