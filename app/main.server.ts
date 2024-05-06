/* eslint-disable ressurectit/imports-order */
import './dependencies';
import xhr2 from 'xhr2';

// //HACK - enables setting cookie header
xhr2.prototype._restrictedHeaders.cookie = false;
xhr2.prototype._restrictedHeaders.cookie2 = false;

// import 'form-data';
import './server.pollyfils';
import './hacks';
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

import {AppSAComponent} from './boot/app.component';
import {config} from './boot/app.config.server';
import {loadDefaultConfig} from './config.loader';

if(isProduction)
{
    enableProdMode();
}

loadDefaultConfig();

const bootstrap = () => bootstrapApplication(AppSAComponent, config);

export default bootstrap;
