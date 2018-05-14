import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventHomeComponent } from './event-home/event-home.component';
import { EventRulesComponent } from './event-rules/event-rules.component';
import { EventSweepstakesComponent } from './event-sweepstakes/event-sweepstakes.component';

const routes: Routes = [
	{ path: '', redirectTo: '/event', pathMatch: 'full' },
	{ path: 'event', component: EventHomeComponent },
	{ path: 'rules', component: EventRulesComponent },
	{ path: 'sweepstakes', component: EventSweepstakesComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
