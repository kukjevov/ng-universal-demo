import {StringDictionary} from '@jscrpt/common';
import {LogEventLevel} from 'structured-log';

import defaultConfig from '../config/config.json';

/**
 * Language definition
 */
export interface LanguageDef
{
    /**
     * Language shortcut used
     */
    lang: string;

    /**
     * Language display name
     */
    name: string;
}

export interface SettingsConfiguration
{
    /**
     * Indication that application is running in debug mode
     */
    debug: boolean;

    /**
     * Indication that missing translation debugging should be enabled
     */
    debugTranslations?: boolean;

    /**
     * Base url that is used for accessing REST api
     */
    apiBaseUrl: string;

    /**
     * Object hodling default headers that are send with rest requests
     */
    defaultApiHeaders: StringDictionary;

    /**
     * Array of available themes
     */
    themes: string[];

    /**
     * Available languages for application
     */
    languages: LanguageDef[];

    /**
     * Indication whether disable mock logger
     */
    disableMockLogger?: boolean;
}

export interface SettingsGeneral
{
    /**
     * Default visual theme of application
     */
    theme: string;

    /**
     * Default selected language
     */
    language: string;
}

export interface SettingsDebug
{
    /**
     * Indication whether is console (logger sink) enabled
     */
    consoleEnabled: boolean;

    /**
     * Indication whether are debug data enabled
     */
    debugData: boolean;
}

export interface SettingsLogging
{
    /**
     * Minimal log level for console sink
     */
    consoleLogLevel: keyof typeof LogEventLevel|string;
}

/**
 * Configuration object
 */
export interface Configuration
{
    /**
     * Static configuration for application
     */
    configuration: SettingsConfiguration;

    /**
     * General settings
     */
    general: SettingsGeneral;

    /**
     * Debug settings, used for debugging purposes
     */
    debug: SettingsDebug;

    /**
     * Logging setting, allows to configure logger sinks
     */
    logging: SettingsLogging;
}

export const config: Configuration = defaultConfig;