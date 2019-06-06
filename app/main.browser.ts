import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {Utils} from '@ng/common';
import {RestTransferStateService} from '@ng/rest';
import * as config from 'config/global';

import {BrowserAppModule} from './boot/browser-app.module';
import {hmrAccept, hmrFinishedNotification} from './hmr';

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

Utils.common.runWhenModuleStable(platform.bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<{}>) => 
{
    moduleRef.injector.get(RestTransferStateService).clearAndDeactivate();
    
    aceDevMode && hmrFinishedNotification();
}, config.debug);
