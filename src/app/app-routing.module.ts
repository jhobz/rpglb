import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventHomeComponent } from './event-home/event-home.component';

const routes: Routes = [
	{ path: '', redirectTo: '/event', pathMatch: 'full' },
	{ path: 'event', component: EventHomeComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }
