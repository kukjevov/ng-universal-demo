/* eslint-disable ressurectit/imports-order */
import './dependencies';
import './dependencies.browser';
import 'zone.js';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {runWhenModuleStable} from '@anglr/common';
import {RestTransferStateService} from '@anglr/rest';
import {hmrFinishedNotification} from '@anglr/common/hmr';

import {config} from './config';
import {BrowserAppModule} from './boot/browser-app.module';

if(isProduction)
{
    enableProdMode();
}

const platform = platformBrowser();

runWhenModuleStable(platform.bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<any>) =>
{
    moduleRef.injector.get(RestTransferStateService)?.clearAndDeactivate();
    jsDevMode && hmrFinishedNotification();
}, config.configuration.debug);
