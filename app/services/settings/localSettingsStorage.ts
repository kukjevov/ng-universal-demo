import {Inject, Injectable} from '@angular/core';
import {PermanentStorage, PERMANENT_STORAGE} from '@anglr/common';
import {extend} from '@jscrpt/common';

import {config, SettingsGeneral, SettingsDebug, SettingsLogging} from '../../config';
import {SettingsStorage} from './settings.interface';

const GENERAL_SETTINGS_STORAGE = 'general-settings';
const DEBUGGING_SETTINGS_STORAGE = 'debugging-settings';
const LOGGING_SETTINGS_STORAGE = 'logging-settings';

/**
 * Settings storage using local storage
 */
@Injectable()
export class LocalSettingsStorage implements SettingsStorage
{
    //######################### constructor #########################
    constructor(@Inject(PERMANENT_STORAGE) private _storage: PermanentStorage,)
    {
    }

    //######################### public methods - implementation of SettingsStorage #########################

    /**
     * Gets general settings object from storage
     */
    public get(): SettingsGeneral
    {
        let settings = this._storage.get<SettingsGeneral>(GENERAL_SETTINGS_STORAGE);

        settings = extend(true,
                          {},
                          <SettingsGeneral>
                          {
                              theme: config.general.theme,
                              language: config.general.language
                          },
                          settings);

        return settings;
    }

    /**
     * Sets general settings object to storage
     * @param config General settings object to be stored
     */
    public set(config: SettingsGeneral): void
    {
        this._storage.set(GENERAL_SETTINGS_STORAGE, config);
    }

    /**
     * Gets debugging settings object from storage
     */
    public getDebugging(): SettingsDebug
    {
        let settings = this._storage.get<SettingsDebug>(DEBUGGING_SETTINGS_STORAGE);

        settings = extend(true,
                          {},
                          <SettingsDebug>
                          {
                              consoleEnabled: config.debug.consoleEnabled,
                              debugData: config.debug.debugData
                          },
                          settings);

        return settings;
    }

    /**
     * Sets debugging settings object to storage
     * @param config Debugging settings object to be stored
     */
    public setDebugging(config: SettingsDebug): void
    {
        this._storage.set(DEBUGGING_SETTINGS_STORAGE, config);
    }

    /**
     * Gets logging settings object from storage
     */
    public getLogging(): SettingsLogging
    {
        let settings = this._storage.get<SettingsLogging>(LOGGING_SETTINGS_STORAGE);

        settings = extend(true,
                          {},
                          <SettingsLogging>
                          {
                              consoleLogLevel: config.logging.consoleLogLevel
                          },
                          settings);

        return settings;
    }

    /**
     * Sets logging settings object to storage
     * @param config Logging settings object to be stored
     */
    public setLogging(config: SettingsLogging)
    {
        this._storage.set(LOGGING_SETTINGS_STORAGE, config);
    }
}