import 'modernizr';
import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {runWhenModuleStable} from '@anglr/common';
import {hmrAccept, hmrFinishedNotification} from '@anglr/common/hmr';
import * as config from 'config/global';

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
    jsDevMode && hmrFinishedNotification();
}, config.debug);