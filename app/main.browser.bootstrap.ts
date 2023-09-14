/* eslint-disable ressurectit/imports-order */
import './dependencies';
import './dependencies.browser';
import 'zone.js';
import './hacks';
import {EnvironmentProviders, Provider, enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {runWhenAppStable} from '@anglr/common';
import {RestTransferStateService} from '@anglr/rest';
import {simpleNotification} from '@jscrpt/common';

import {AppSAComponent} from './boot/app.component';
import {config} from './config';
import {appProviders} from './boot/app.providers';
import {browserAppProviders} from './boot/browser-app.providers';
import {globalProviders} from './boot/app.config';

if(isProduction)
{
    enableProdMode();
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
