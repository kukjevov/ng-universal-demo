import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserTransferStateModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppModule} from './app.module';

/**
 * Entry module for browser side
 */
@NgModule(
{
    bootstrap: [AppComponent],
    imports:
    [
        AppModule,
        BrowserAnimationsModule,
        BrowserTransferStateModule
    ],
    providers:
    [
    ]
})
export class BrowserAppModule
{
}
