/* eslint-disable ressurectit/imports-order */
import '../config/configBrowserOverride';
import {enableProdMode} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {createApplication} from '@angular/platform-browser';

import {appConfig} from './boot/app.config';
import {CustomSAComponent} from './components';

if(isProduction)
{
    enableProdMode();
}

(async () => 
{
    const appRef = await createApplication(appConfig);

    const customComponent = createCustomElement(CustomSAComponent,
    {
        injector: appRef.injector,
    });

    customElements.define('lol-el', customComponent);
})();
