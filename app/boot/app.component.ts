import {Component, OnDestroy} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import {GlobalizationService, ProgressIndicatorService, CookieService} from '@ng/common';
import {AuthenticationService} from '@ng/authentication';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from 'rxjs';
import * as global from 'config/global';
import * as moment from 'moment';

import {LANG_COOKIE} from '../misc/constants';

/**
 * Application entry component
 */
@Component(
{
    selector: 'app',
    templateUrl: "app.component.html"
})
export class AppComponent implements OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription for route changes
     */
    private _routeChangeSubscription: Subscription;

    //######################### constructor #########################
    constructor(authetication: AuthenticationService<any>,
                translate: TranslateService,
                globalization: GlobalizationService,
                router: Router,
                progressIndicatorService: ProgressIndicatorService,
                cookieService: CookieService) 
    {
        this._routeChangeSubscription = router.events.subscribe((next) =>
        {
            if(next instanceof NavigationStart)
            {
                progressIndicatorService.showProgress();
            }
            else if(next instanceof NavigationEnd || next instanceof NavigationError || next instanceof NavigationCancel)
            {
                progressIndicatorService.hideProgress();
            }
        })

        var currentLang: string = global.defaultLanguage;
        var storedCookie = cookieService.getCookie(LANG_COOKIE);

        if(storedCookie)
        {
            currentLang = storedCookie;
        }
        
        moment.locale(globalization.locale);
        translate.setDefaultLang(currentLang);
        translate.use(currentLang);

        authetication
            .getUserIdentity()
            .then(identity =>
            {
                if(!identity)
                {
                    console.error("User identity was not returned!");
                }

                if(!identity.isAuthenticated && !authetication.isAuthPage())
                {
                    authetication.showAuthPage();
                }
            });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._routeChangeSubscription)
        {
            this._routeChangeSubscription.unsubscribe();
            this._routeChangeSubscription = null;
        }
    }
}