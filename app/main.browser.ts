import './dependencies';
import 'zone.js/dist/zone';
import {platformBrowser} from '@angular/platform-browser';

import {BrowserAppModule} from './boot/browser-app.module';

var platform = platformBrowser();

platform.bootstrapModule(BrowserAppModule);
