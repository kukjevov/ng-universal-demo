import {EnvironmentProviders, FactoryProvider, Provider, importProvidersFrom} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';
import {HotkeyModule} from 'angular2-hotkeys';

import {config} from '../config';

/**
 * Browser specific app providers
 */
export const browserAppProviders: (Provider|EnvironmentProviders)[] =
[
    provideAnimations(),
    <FactoryProvider>
    {
        provide: AnglrExceptionHandlerOptions,
        useFactory: () => new AnglrExceptionHandlerOptions(config.configuration.debug, false)
    },
    provideServiceWorker('ngsw-worker.js', 
    {
        enabled: isProduction,
        // enabled: true,
        registrationStrategy: 'registerWhenStable:15000',
    }),
    importProvidersFrom(HotkeyModule.forRoot(
                        {
                            cheatSheetCloseEsc: true
                        })),
];
