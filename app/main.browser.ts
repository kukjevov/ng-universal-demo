import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef, enableProdMode} from '@angular/core';
import {Utils} from '@ng/common';
import {RestTransferStateService} from '@ng/rest';
import {BrowserAppModule} from './boot/browser-app.module';
import * as config from 'config/global';

if(isProduction)
{
    enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => 
{
    Utils.common.runWhenModuleStable(platformBrowser().bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<{}>) => 
    {
        moduleRef.injector.get(RestTransferStateService).clearAndDeactivate();
    }, config.debug);
});