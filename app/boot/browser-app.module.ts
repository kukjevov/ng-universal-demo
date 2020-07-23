import {NgModule, FactoryProvider} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserTransferStateModule} from '@angular/platform-browser';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';
import {HotkeyModule} from 'angular2-hotkeys';

import {config} from '../config';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';

/**
 * Factory for AnglrExceptionHandlerOptions
 */
export function anglrExceptionHandlerOptionsFactory()
{
    return new AnglrExceptionHandlerOptions(config.configuration.debug, false);
}

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
        BrowserTransferStateModule,
        HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true
        })
    ],
    providers:
    [
        <FactoryProvider>
        {
            provide: AnglrExceptionHandlerOptions,
            useFactory: anglrExceptionHandlerOptionsFactory
        }
    ]
})
export class BrowserAppModule
{
}
