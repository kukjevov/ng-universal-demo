import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {runWhenAppStable} from '@anglr/common';
import {simpleNotification} from '@jscrpt/common';

import {AppSAComponent} from './boot/app.component';
import {config} from './config';
import {appConfig} from './boot/app.config';

if(isProduction)
{
    enableProdMode();
}

runWhenAppStable(bootstrapApplication(AppSAComponent, appConfig), _ =>
{
    jsDevMode && simpleNotification(jsDevMode && !!import.meta.webpackHot);
}, config.configuration.debug);
