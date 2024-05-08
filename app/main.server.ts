/* eslint-disable ressurectit/imports-spacing */
/* eslint-disable ressurectit/imports-order */
import xhr2 from 'xhr2';

// //HACK - enables setting cookie header
xhr2.prototype._restrictedHeaders.cookie = false;
xhr2.prototype._restrictedHeaders.cookie2 = false;

// import 'form-data';
import '../config/configServerOverride';
import './server.pollyfils';
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
