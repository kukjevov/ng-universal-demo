import 'modernizr';
import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';

import {BrowserAppModule} from './boot/browser-app.module';

if(isProduction)
{
    enableProdMode();
}

var platform = platformBrowser();

platform.bootstrapModule(BrowserAppModule);