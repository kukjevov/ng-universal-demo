import {ApplicationConfig, FactoryProvider, importProvidersFrom} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';
import {HotkeyModule} from 'angular2-hotkeys';

import {appProviders} from './app.providers';
import {config} from '../config';

/**
 * Application configuration for browser
 */
export const appConfig: ApplicationConfig = 
{
    providers:
    [
        ...appProviders,
        provideAnimations(),
        <FactoryProvider>
        {
            provide: AnglrExceptionHandlerOptions,
            useFactory: () => new AnglrExceptionHandlerOptions(config.configuration.debug, false)
        },
        provideServiceWorker('ngsw-worker.js', 
        {
            enabled: isProduction,
            registrationStrategy: 'registerWhenStable:15000',
        }),
        importProvidersFrom(HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true
        })),
    ],
};
