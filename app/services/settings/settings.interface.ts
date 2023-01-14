import {SettingsGeneral, SettingsDebug, SettingsLogging} from '../../config';

/**
 * Definition of settings storage
 */
export interface SettingsStorage
{
    /**
     * Gets general settings object from storage
     */
    get(): SettingsGeneral;

    /**
     * Sets general settings object to storage
     * @param config General settings object to be stored
     */
    set(config: SettingsGeneral): void;

    /**
     * Gets debugging settings object from storage
     */
    getDebugging(): SettingsDebug;

    /**
     * Sets debugging settings object to storage
     * @param config Debugging settings object to be stored
     */
    setDebugging(config: SettingsDebug): void;

    /**
     * Gets logging settings object from storage
     */
    getLogging(): SettingsLogging;

    /**
     * Sets logging settings object to storage
     * @param config Logging settings object to be stored
     */
    setLogging(config: SettingsLogging): void;
}