/* eslint-disable ressurectit/imports-spacing */
/* eslint-disable ressurectit/imports-order */
import '../config/configServerOverride';
import './server.pollyfils';
import './hacks';
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

import {AppSAComponent} from './boot/app.component';
import {config} from './boot/app.config.server';

if(isProduction)
{
    enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppSAComponent, config);

export default bootstrap;
