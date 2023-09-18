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
import {EnvironmentProviders, Provider, enableProdMode} from '@angular/core';
import {provideServerRendering, renderApplication} from '@angular/platform-server';
import {serverRenderFactory, ServerRenderOptions} from '@anglr/server-stuff';
import {provideServerHotkeysService} from '@anglr/server-stuff/hotkeys';

import {AdditionalData, getAdditionalProviders} from './server.providers';
import {loadDefaultConfig} from './config.loader';
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';
import {AppSAComponent} from './boot/app.component';
import {appProviders} from './boot/app.providers';
import {globalProviders} from './boot/app.config';

enableProdMode();
loadDefaultConfig();

const providers: (Provider|EnvironmentProviders)[] =
[
    ...appProviders,
    // ...browserAppProviders,
    ...globalProviders,
];

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
                ...providers,
                provideServerRendering(),
                provideClientHydration(),
                provideServerHotkeysService(),
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