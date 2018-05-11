import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './/app-routing.module';
import { AppComponent } from './app.component';
import { EventHomeComponent } from './event-home/event-home.component';
import { EventRulesComponent } from './event-rules/event-rules.component';
import { MoneifyPipe } from './moneify.pipe';


@NgModule({
	declarations: [
		AppComponent,
		EventHomeComponent,
		MoneifyPipe,
		EventRulesComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
