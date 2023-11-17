import {Component, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Inject, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {RouterModule, RouterOutlet} from '@angular/router';
import {ConsoleSAComponent, LOGGER, Logger, ProgressIndicatorModule, consoleAnimationTrigger} from '@anglr/common';
import {AppHotkeysService, HotkeysCheatsheetSAComponent} from '@anglr/common/hotkeys';
import {InternalServerErrorSAComponent} from '@anglr/error-handling';
import {NotificationsGlobalModule} from '@anglr/notifications';
import {fadeInOutTrigger} from '@anglr/animations';
import {AuthenticationService} from '@anglr/authentication';
import {lastValueFrom} from '@jscrpt/common/rxjs';
import {nameof} from '@jscrpt/common';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Hotkey} from 'angular2-hotkeys';

import {MenuModule} from '../modules';
import {loaderTrigger, routeAnimationTrigger} from './app.component.animations';
import {ConfigReleaseService} from '../services/api/configRelease/configRelease.service';
import {SettingsDebug, SettingsGeneral} from '../config';
import version from '../../config/version.json';
import {SettingsService} from '../services/settings';

/**
 * Application root component
 */
@Component(
{
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports:
    [
        CommonModule,
        RouterModule,
        InternalServerErrorSAComponent,
        ProgressIndicatorModule,
        NotificationsGlobalModule,
        MenuModule,
        ConsoleSAComponent,
        HotkeysCheatsheetSAComponent,
    ],
    animations: [routeAnimationTrigger, fadeInOutTrigger, consoleAnimationTrigger, loaderTrigger],
    providers: [AppHotkeysService, ConfigReleaseService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSAComponent implements OnInit, AfterViewInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for router outlet activation changes
     */
    private _routerOutletActivatedSubscription: Subscription|undefined|null;

    /**
     * Subscription for changes of general settings
     */
    private _settingsChangeSubscription: Subscription;

    /**
     * Subscription for changes of debugging settings
     */
    private _settingsDebuggingChangeSubscription: Subscription;

    /**
     * Currently active theme
     */
    private _theme: string;

    //######################### public properties - template bindings #########################

    /**
     * Indication whether is console visible
     */
    public consoleVisible: boolean = false;

    /**
     * Name of state for routed component animation
     */
    public routeComponentState: string = 'none';

    /**
     * Current version of gui
     */
    public guiVersion: string = version.version;

    /**
     * Version of server
     */
    public serverVersion: string = '';

    /**
     * Name of server
     */
    public serverName: string = '';

    /**
     * Indication whether is application initialized
     */
    public initialized: boolean = false;

    //######################### public properties - children #########################

    /**
     * Router outlet that is used for loading routed components
     */
    @ViewChild('outlet')
    public routerOutlet: RouterOutlet|undefined|null;

    //######################### constructor #########################
    constructor(_authSvc: AuthenticationService,
                translateSvc: TranslateService,
                private _changeDetector: ChangeDetectorRef,
                private _appHotkeys: AppHotkeysService,
                private _configSvc: ConfigReleaseService,
                settings: SettingsService,
                @Inject(LOGGER) logger: Logger,
                @Inject(DOCUMENT) document: Document,)
    {
        logger.verbose('Application is starting, main component constructed.');

        document.body.classList.add('app-page', settings.settings.theme);
        this._theme = settings.settings.theme;

        new Konami(() =>
        {
            console.log('konami enabled');
        });

        this._settingsChangeSubscription = settings.settingsChange
            .subscribe(itm =>
            {
                if(itm == nameof<SettingsGeneral>('theme'))
                {
                    document.body.classList.remove(this._theme);
                    this._theme = settings.settings.theme;
                    document.body.classList.add(this._theme);
                }

                if(itm == nameof<SettingsGeneral>('language'))
                {
                    translateSvc.use(settings.settings.language);
                    this._changeDetector.detectChanges();
                }
            });

        this._settingsDebuggingChangeSubscription = settings.settingsDebuggingChange
            .subscribe(itm =>
            {
                if(itm == nameof<SettingsDebug>('consoleEnabled'))
                {
                    this._toggleConsoleHotkey();
                }
            });

        translateSvc.setDefaultLang('en');
        translateSvc.use(settings.settings.language);

        if(settings.settingsDebugging?.consoleEnabled)
        {
            this._toggleConsoleHotkey();
        }
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public async ngOnInit(): Promise<void>
    {
        const srvCfg = await lastValueFrom(this._configSvc.get());

        this.serverVersion = srvCfg?.release ?? '';
        this.serverName = srvCfg?.name ?? '';

        this._changeDetector.detectChanges();
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._routerOutletActivatedSubscription = this.routerOutlet?.activateEvents.subscribe(() =>
        {
            this.routeComponentState = this.routerOutlet?.activatedRouteData['animation'] || (<any>this.routerOutlet?.activatedRoute.component).name;
        });

        this.initialized = true;
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._routerOutletActivatedSubscription?.unsubscribe();
        this._routerOutletActivatedSubscription = null;

        this._settingsChangeSubscription?.unsubscribe();
        this._settingsDebuggingChangeSubscription?.unsubscribe();

        this._appHotkeys.destroy();
    }

    //######################### private methods #########################

    /**
     * Toggles hotkey for displaying console log
     */
    private _toggleConsoleHotkey()
    {
        const oldHelpHotkey = this._appHotkeys.hotkeys.get('~');

        if(oldHelpHotkey)
        {
            this._appHotkeys.hotkeys.remove(oldHelpHotkey);
        }
        else
        {
            this._appHotkeys.hotkeys.add(new Hotkey('~', () =>
            {
                this.consoleVisible = !this.consoleVisible;
                this._changeDetector.detectChanges();

                return false;
            }, undefined, 'Show console'));
        }
    }
}