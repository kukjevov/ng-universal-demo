/* eslint-disable ressurectit/imports-order */
import './dependencies';
import './dependencies.browser';
import 'zone.js';
import './hacks';
import {EnvironmentProviders, FactoryProvider, Provider, enableProdMode, importProvidersFrom} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideServiceWorker} from '@angular/service-worker';
import {runWhenAppStable} from '@anglr/common';
import {AnglrExceptionHandlerOptions} from '@anglr/error-handling';
import {simpleNotification} from '@jscrpt/common';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppSAComponent} from './boot/app.component';
import {config} from './config';
import {appProviders} from './boot/app.providers';

if(isProduction)
{
    enableProdMode();
}

const providers: (Provider|EnvironmentProviders)[] =
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
];

runWhenAppStable(bootstrapApplication(AppSAComponent, {providers}), () =>
{
    jsDevMode && simpleNotification(jsDevMode && !!import.meta.webpackHot);
}, config.configuration.debug);
