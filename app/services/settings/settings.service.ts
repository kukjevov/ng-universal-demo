import {Injectable, KeyValueDiffers, Inject, KeyValueDiffer} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Subject, Observable} from 'rxjs';

import {SettingsStorage} from './settings.interface';
import {SETTINGS_STORAGE} from '../../misc/tokens';
import {SettingsGeneral, SettingsDebug, SettingsLogging} from '../../config';

/**
 * Class used as settings service
 */
@Injectable({providedIn: 'root'})
export class SettingsService
{
    //######################### private methods #########################

    /**
     * Current general settings value
     */
    private _settings: SettingsGeneral = this._storage.get();

    /**
     * Current debugging settings value
     */
    private _settingsDebugging: SettingsDebug = this._storage.getDebugging();

    /**
     * Current logging settings value
     */
    private _settingsLogging: SettingsLogging = this._storage.getLogging();

    /**
     * General settings value differ
     */
    private _settingsValueDiff: KeyValueDiffer<any, any>;

    /**
     * Debugging settings value differ
     */
    private _settingsDebuggingValueDiff: KeyValueDiffer<any, any>;

    /**
     * Occurs when any of general settings properties change
     */
    private _settingsChangeSubject: Subject<keyof SettingsGeneral> = new Subject<keyof SettingsGeneral>();

    /**
     * Occurs when any of debugging settings properties change
     */
    private _settingsDebuggingChangeSubject: Subject<keyof SettingsDebug> = new Subject<keyof SettingsDebug>();

    //######################### public properties #########################

    /**
     * Gets general settings object value
     */
    public get settings(): SettingsGeneral
    {
        return this._settings;
    }

    /**
     * Gets debugging settings object value
     */
    public get settingsDebugging(): SettingsDebug
    {
        return this._settingsDebugging;
    }

    /**
     * Gets logging settings object value
     */
    public get settingsLogging(): SettingsLogging
    {
        return this._settingsLogging;
    }

    /**
     * Occurs when any of general settings properties change
     */
    public get settingsChange(): Observable<keyof SettingsGeneral>
    {
        return this._settingsChangeSubject.asObservable();
    }

    /**
     * Occurs when any of debugging settings properties change
     */
    public get settingsDebuggingChange(): Observable<keyof SettingsDebug>
    {
        return this._settingsDebuggingChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(keyValueDiffers: KeyValueDiffers,
                @Inject(SETTINGS_STORAGE) private _storage: SettingsStorage)
    {
        this._settingsValueDiff = keyValueDiffers.find(this._settings).create();
        this._settingsValueDiff.diff(this._settings);

        this._settingsDebuggingValueDiff = keyValueDiffers.find(this._settingsDebugging).create();
        this._settingsDebuggingValueDiff.diff(this._settingsDebugging);
    }

    //######################### public methods #########################

    /**
     * Sets new general settings
     * @param settings Instance of general settings object
     */
    public setSettings(settings: SettingsGeneral): void
    {
        this._settings = extend(true, {}, this._settings, settings);
        this._storage.set(settings);

        const diff = this._settingsValueDiff.diff(settings);
        
        if(diff)
        {
            diff.forEachChangedItem(itm =>
            {
                this._settingsChangeSubject.next(itm.key as any);
            });
        }
    }

    /**
     * Sets new debugging settings
     * @param settings Instance of debugging settings object
     */
    public setDebuggingSettings(settings: SettingsDebug): void
    {
        this._settingsDebugging = extend(true, {}, this._settingsDebugging, settings);
        this._storage.setDebugging(settings);

        const diff = this._settingsDebuggingValueDiff.diff(settings);
        
        if(diff)
        {
            diff.forEachChangedItem(itm =>
            {
                this._settingsDebuggingChangeSubject.next(itm.key as any);
            });
        }
    }

    /**
     * Sets new logging settings
     * @param settings Instance of logging settings object
     */
    public setLoggingSettings(settings: SettingsLogging): void
    {
        this._settingsLogging = extend(true, {}, this._settingsLogging, settings);
        this._storage.setLogging(settings);
    }
}