import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventHomeComponent } from './event-home/event-home.component';
import { EventRulesComponent } from './event-rules/event-rules.component';

const routes: Routes = [
	{ path: '', redirectTo: '/event', pathMatch: 'full' },
	{ path: 'event', component: EventHomeComponent },
	{ path: 'rules', component: EventRulesComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
