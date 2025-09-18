import {Component, ChangeDetectionStrategy, Inject, OnDestroy, WritableSignal, signal} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ConsoleComponent, LOGGER, Logger, ProgressIndicatorModule} from '@anglr/common';
import {AppHotkeysService, HotkeysCheatsheetComponent} from '@anglr/common/hotkeys';
import {InternalServerErrorComponent} from '@anglr/error-handling';
import {NotificationsGlobalModule} from '@anglr/notifications';
import {AuthenticationService} from '@anglr/authentication';
import {nameof} from '@jscrpt/common';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {Hotkey} from 'angular2-hotkeys';

import {MenuModule} from '../modules';
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
    styleUrl: 'app.component.scss',
    standalone: true,
    imports:
    [
        RouterOutlet,
        InternalServerErrorComponent,
        ProgressIndicatorModule,
        NotificationsGlobalModule,
        MenuModule,
        ConsoleComponent,
        HotkeysCheatsheetComponent,
    ],
    providers: [AppHotkeysService, ConfigReleaseService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy
{
    //######################### private fields #########################

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
    public consoleVisible: WritableSignal<boolean> = signal(false);

    /**
     * Current version of gui
     */
    public guiVersion: string = version.version;

    /**
     * Indication whether is application initialized
     */
    public initialized: boolean = false;

    //######################### constructor #########################
    constructor(_authSvc: AuthenticationService,
                translateSvc: TranslateService,
                private _appHotkeys: AppHotkeysService,
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

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
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
                this.consoleVisible.update(val => !val);

                return false;
            }, undefined, 'Show console'));
        }
    }
}
