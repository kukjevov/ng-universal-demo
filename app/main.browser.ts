/* eslint-disable ressurectit/imports-order */
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

import {AppSAComponent} from './boot/app.component';
import {appConfig} from './boot/app.config';

if(isProduction)
{
    enableProdMode();
}

bootstrapApplication(AppSAComponent, appConfig);
