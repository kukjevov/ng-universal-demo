import './dependencies';
import './dependencies.browser';
import 'zone.js/dist/zone';
import './hacks';
import {platformBrowser} from '@angular/platform-browser';
import {NgModuleRef} from '@angular/core';
//@ts-ignore
import {hmrAccept, hmrFinishedNotification} from '@ng/common';
import {Utils} from '@ng/common';
import {RestTransferStateService} from '@ng/rest';
import {BrowserAppModule} from './boot/browser-app.module';
import * as config from 'config/global';

// Enable Hot Module Reloading if available

if (module['hot'])
{
    module['hot'].accept();
    module['hot'].dispose(() =>
    {
        platform.destroy();

        if(!document.querySelector('app'))
        {
        	$('body').append('<app></app>');
        }

        if((<any>window).___hmrDataGetters)
        {
            let getters = (<any>window).___hmrDataGetters;
            let data = (<any>window).___hmrData = {};
        
            Object.keys(getters).forEach((hmrKey: string) =>
            {
                data[hmrKey] = getters[hmrKey]();
            });
        }
    });
}

var platform = platformBrowser();

Utils.common.runWhenModuleStable(platform.bootstrapModule(BrowserAppModule), (moduleRef: NgModuleRef<{}>) => 
{
    moduleRef.injector.get(RestTransferStateService).clearAndDeactivate();
    
    if (module['hot'])
    {
        $('<div id="hmrdiv" style="display: none; position: absolute; z-index: 54345; background: rgb(255, 255, 255) none repeat scroll 0% 0%; padding: 8px; font-weight: bold; border-radius: 6px; color: rgb(21, 57, 255); left: 47%; top: 11px;  box-shadow: 0px 0px 4px rgb(170, 170, 170);">HMR finished, app updated!</div>')
            .appendTo("body")
            .fadeIn()
            .click(function()
            {
                $(this).remove();
            });
        setTimeout(function()
        {
            $("#hmrdiv").fadeOut(function()
            {
                $(this).remove();
            });
        }, 2000);
    }
}, config.debug);
