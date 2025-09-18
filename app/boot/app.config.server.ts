import {mergeApplicationConfig, ApplicationConfig, FactoryProvider} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {provideServerHotkeysService} from '@anglr/server-stuff/hotkeys';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';

import {appConfig} from './app.config';
import {config as cfg} from '../config';

//Server configuration
const serverConfig: ApplicationConfig =
{
    providers:
    [
        provideServerRendering(),
        provideServerHotkeysService(),
        <FactoryProvider>
        {
            provide: AnglrExceptionHandlerOptions,
            useFactory: () => new AnglrExceptionHandlerOptions(cfg.configuration.debug, false)
        },
    ],
};

/**
 * Application configuration for server merged with browser configuration
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
