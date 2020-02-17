import {NgModule, FactoryProvider} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ReportingExceptionHandlerOptions} from '@anglr/error-handling';
import {ServerProvidersModule} from '@anglr/server-stuff';

import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import * as config from 'config/global';

/**
 * Factory for ReportingExceptionHandlerOptions
 */
export function reportingExceptionHandlerOptionsFactory()
{
	return new ReportingExceptionHandlerOptions(config.debug, false, false, false, false, false);
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
        ServerProvidersModule
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
