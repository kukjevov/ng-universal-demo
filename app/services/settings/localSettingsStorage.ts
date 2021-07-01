import {Injectable} from '@angular/core';
import {extend} from '@jscrpt/common';
import store from 'store';

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
    //######################### public methods - implementation of SettingsStorage #########################

    /**
     * Gets general settings object from storage
     */
    public get(): SettingsGeneral
    {
        let settings = store.get(GENERAL_SETTINGS_STORAGE);

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
        store.set(GENERAL_SETTINGS_STORAGE, config);
    }

    /**
     * Gets debugging settings object from storage
     */
    public getDebugging(): SettingsDebug
    {
        let settings = store.get(DEBUGGING_SETTINGS_STORAGE);

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
        store.set(DEBUGGING_SETTINGS_STORAGE, config);
    }

    /**
     * Gets logging settings object from storage
     */
    public getLogging(): SettingsLogging
    {
        let settings = store.get(LOGGING_SETTINGS_STORAGE);

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
        store.set(LOGGING_SETTINGS_STORAGE, config);
    }
}