import {EnvironmentProviders, FactoryProvider, Provider, importProvidersFrom} from '@angular/core';
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
    importProvidersFrom(HotkeyModule.forRoot(
                        {
                            cheatSheetCloseEsc: true
                        })),
];
