/* eslint-disable ressurectit/imports-order */
import './dependencies';
import xhr2 from 'xhr2';

// //HACK - enables setting cookie header
xhr2.prototype._restrictedHeaders.cookie = false;
xhr2.prototype._restrictedHeaders.cookie2 = false;

// import 'form-data';
import 'zone.js/node';
import './server.pollyfils';
import './hacks';
import {FactoryProvider, enableProdMode} from '@angular/core';
import {provideServerRendering, renderApplication} from '@angular/platform-server';
import {serverRenderFactory, ServerRenderOptions} from '@anglr/server-stuff';
import {provideServerHotkeysService} from '@anglr/server-stuff/hotkeys';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';

import {AdditionalData, getAdditionalProviders} from './server.providers';
import {loadDefaultConfig} from './config.loader';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppSAComponent} from './boot/app.component';
import {appProviders} from './boot/app.providers';
import {config} from './config';

enableProdMode();
loadDefaultConfig();

/**
 * Gets promise that renders app into string
 * @param options - Options for server render
 */
function getRenderPromise(options: ServerRenderOptions): Promise<string>
{
    return renderApplication(() =>
    {
        return bootstrapApplication(AppSAComponent,
        {
            providers:
            [
                ...appProviders,
                provideServerRendering(),
                provideServerHotkeysService(),
                <FactoryProvider>
                {
                    provide: AnglrExceptionHandlerOptions,
                    useFactory: () => new AnglrExceptionHandlerOptions(config.configuration.debug, false)
                },
                ...options.appProviders ?? [],
            ]
        });
    }, 
    {
        document: options.document,
        url: options.url,
        platformProviders: options.platformProviders,
    });
}

export const serverRender = serverRenderFactory<AdditionalData>(getRenderPromise, getAdditionalProviders);