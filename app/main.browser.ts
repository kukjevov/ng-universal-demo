import 'modernizr';
import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {runWhenModuleStable} from '@ng/common';
import {hmrAccept, hmrFinishedNotification} from '@ng/common/hmr';
import * as config from 'config/global';

import {BrowserAppModule} from './boot/browser-app.module';

if(isProduction)
{
    enableProdMode();
}

if (aceDevMode && module['hot'])
{
    module['hot'].accept();
}

aceDevMode && hmrAccept(() => platform);

var platform = platformBrowser();

runWhenModuleStable(platform.bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<{}>) => 
{    
    aceDevMode && hmrFinishedNotification();
}, config.debug);