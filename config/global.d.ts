type LogLevelString = 'off'|'fatal'|'error'|'warning'|'information'|'debug'|'verbose'|string;

/**
 * Language definition
 */
interface LanguageDef
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

interface SettingsConfiguration
{
    /**
     * Indication that application is running in debug mode
     */
    debug: boolean;

    /**
     * Base url that is used for accessing REST api
     */
    apiBaseUrl: string;

    /**
     * Object hodling default headers that are send with rest requests
     */
    defaultApiHeaders: { [key: string]: string };

    /**
     * Array of available themes
     */
    themes: string[];

    /**
     * Available languages for application
     */
    languages: LanguageDef[];
}

interface SettingsGeneral
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

interface SettingsDebug
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

interface SettingsLogging
{
    /**
     * Minimal log level for console sink
     */
    consoleLogLevel: LogLevelString;
}

declare module "config/global"
{
    var _tmp:
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
    };

    export = _tmp;
}

declare module "config/version"
{
    var _tmp:
    {
        /**
         * Version of current running application
         */
        version: string;
    };

    export = _tmp;
}

declare var isProduction: boolean;