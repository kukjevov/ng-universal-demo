/* eslint-disable ressurectit/imports-order */
import './dependencies';
import './dependencies.browser';
import 'zone.js';
import './hacks';
import {ApplicationRef, EnvironmentProviders, Provider, enableProdMode} from '@angular/core';
import {bootstrapApplication, enableDebugTools} from '@angular/platform-browser';
import {APP_STABLE, extractAppStableResolve} from '@anglr/common';
import {RestTransferStateService} from '@anglr/rest';
import {Action1, simpleNotification} from '@jscrpt/common';
import {filter, first} from 'rxjs';

import {AppSAComponent} from './boot/appSA.component';
import {config} from './config';
import {appProviders} from './boot/app.providers';
import {browserAppProviders} from './boot/browser-app.providers';
import {globalProviders} from './boot/app.config';

if(isProduction)
{
    enableProdMode();
}

function runWhenAppStable(appRefPromise: Promise<ApplicationRef>, callback: Action1<ApplicationRef>, angularProfiler?: boolean): void
{
    angularProfiler = angularProfiler ?? false;

    appRefPromise.then(appRef => 
    {
        appRef.isStable
            .pipe(filter(isStable => isStable),
                  first())
            .subscribe(() => 
            {
                const appStablePromise = appRef.injector.get(APP_STABLE);

                if(angularProfiler)
                {
                    enableDebugTools(appRef.components[0]);
                }

                callback(appRef);

                const resolveAsStable = extractAppStableResolve(appStablePromise);
                resolveAsStable();
            });
    });
}

const providers: (Provider|EnvironmentProviders)[] =
[
    ...appProviders,
    ...browserAppProviders,
    ...globalProviders,
];

runWhenAppStable(bootstrapApplication(AppSAComponent, {providers}), appRef =>
{
    appRef.injector.get(RestTransferStateService)?.clearAndDeactivate();
    jsDevMode && simpleNotification(jsDevMode && !!import.meta.webpackHot);
}, config.configuration.debug);
