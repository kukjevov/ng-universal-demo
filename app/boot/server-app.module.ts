import {NgModule, FactoryProvider} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';
import {ServerProvidersModule} from '@anglr/server-stuff';
import {ServerHotkeysModule} from '@anglr/server-stuff/hotkeys';

import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {config} from '../config';

/**
 * Factory for AnglrExceptionHandlerOptions
 */
export function anglrExceptionHandlerOptionsFactory()
{
	return new AnglrExceptionHandlerOptions(config.configuration.debug, false);
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
            provide: AnglrExceptionHandlerOptions,
            useFactory: anglrExceptionHandlerOptionsFactory
        }
    ]
})
export class ServerAppModule 
{
}
