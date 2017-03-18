import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';

@NgModule(
{
	bootstrap: [AppComponent],
	imports: [AppModule, BrowserAnimationsModule]
})
export class BrowserAppModule
{
}
