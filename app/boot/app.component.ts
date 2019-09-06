import {Component, OnDestroy} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import {GlobalizationService, ProgressIndicatorService} from '@ng/common';
import {AuthenticationService} from '@ng/authentication';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from 'rxjs';
import * as config from 'config/global';
import * as moment from 'moment';

/**
 * Application entry component
 */
@Component(
{
    selector: 'app',
    templateUrl: "app.component.html",
    styleUrls: ['app.component.scss']
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
                progressIndicatorService: ProgressIndicatorService) 
    {
        document.body.classList.add("app-page", config.theme);

        new Konami(() =>
        {
            console.log('koname enabled');
        });

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
        });
        
        moment.locale(globalization.locale);
        translate.setDefaultLang('en');
        translate.use(config.language);

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