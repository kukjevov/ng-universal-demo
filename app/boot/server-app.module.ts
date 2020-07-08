import {NgModule, FactoryProvider} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ReportingExceptionHandlerOptions} from '@anglr/error-handling';
import {ServerProvidersModule} from '@anglr/server-stuff';
import {ServerHotkeysModule} from '@anglr/server-stuff/hotkeys';

import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {config} from '../config';

/**
 * Factory for ReportingExceptionHandlerOptions
 */
export function reportingExceptionHandlerOptionsFactory()
{
	return new ReportingExceptionHandlerOptions(config.configuration.debug, false, false, false, false, false);
}

/**
 * Entry module for server side
 */
@NgModule(
{
    bootstrap: [AppComponent],
    imports: 
    [
        AppModule,
        ServerModule,
        ServerTransferStateModule,
        ServerProvidersModule,
        ServerHotkeysModule
    ],
    providers:
    [
        <FactoryProvider>
        {
            provide: ReportingExceptionHandlerOptions,
            useFactory: reportingExceptionHandlerOptionsFactory
        }
    ]
})
export class ServerAppModule 
{
}
