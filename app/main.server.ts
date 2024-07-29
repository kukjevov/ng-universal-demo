/* eslint-disable ressurectit/imports-spacing */
/* eslint-disable ressurectit/imports-order */
import '../config/configServerOverride';
import './server.pollyfils';
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

import {AppComponent} from './boot/app.component';
import {config} from './boot/app.config.server';

if(isProduction)
{
    enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
