import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {runWhenModuleStable} from '@anglr/common';
import {RestTransferStateService} from '@anglr/rest';
import {hmrAccept, hmrFinishedNotification} from '@anglr/common/hmr';

import {config} from './config';
import {BrowserAppModule} from './boot/browser-app.module';

if(isProduction)
{
    enableProdMode();
}

if (jsDevMode && module['hot'])
{
    module['hot'].accept();
}

jsDevMode && hmrAccept(() => platform);

var platform = platformBrowser();

runWhenModuleStable(platform.bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<{}>) =>
{
    moduleRef.injector.get(RestTransferStateService)?.clearAndDeactivate();
    jsDevMode && hmrFinishedNotification();
}, config.configuration.debug);