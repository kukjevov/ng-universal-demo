import {Component, OnDestroy, AfterViewInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RouterOutlet} from '@angular/router';
import {GlobalizationService, ProgressIndicatorService} from '@ng/common';
import {AuthenticationService} from '@ng/authentication';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from 'rxjs';
import * as config from 'config/global';
import * as moment from 'moment';

import {routeAnimationTrigger} from './app.component.animations';

/**
 * Application entry component
 */
@Component(
{
    selector: 'app',
    templateUrl: "app.component.html",
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routeAnimationTrigger]
})
export class AppComponent implements AfterViewInit, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription for route changes
     */
    private _routeChangeSubscription: Subscription;

    /**
     * Subscription for router outlet activation changes
     */
    private _routerOutletActivatedSubscription: Subscription;

    /**
    /**
     * Name of state for routed component animation
     */
    public routeComponentState: string = 'none';

    //######################### public properties - children #########################

    /**
     * Router outlet that is used for loading routed components
     */
    @ViewChild('outlet', {static: false})
    public routerOutlet: RouterOutlet;

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

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._routerOutletActivatedSubscription = this.routerOutlet.activateEvents.subscribe(() =>
        {
            this.routeComponentState = this.routerOutlet.activatedRouteData['animation'] || (<any>this.routerOutlet.activatedRoute.component).name;
        });
    }

    public prepareRoute(outlet: RouterOutlet) 
    {
        if(!outlet.isActivated)
        {
            return 'none';
        }

        return (<any>outlet.activatedRoute.component).name;
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

        if(this._routerOutletActivatedSubscription)
        {
            this._routerOutletActivatedSubscription.unsubscribe();
            this._routerOutletActivatedSubscription = null;
        }
    }
}