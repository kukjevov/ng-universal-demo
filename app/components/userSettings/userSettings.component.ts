import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {DebugDataEnabledService} from '@anglr/common';
import {ConsoleSinkConfigService} from '@anglr/common/structured-log';
import {ValueNamePair} from '@jscrpt/common';
import {LogEventLevel} from 'structured-log';

import {config, SettingsGeneral, SettingsDebug, LanguageDef} from '../../config';
import {SettingsService} from '../../services/settings';
import {DisplayingFeatureModule} from '../../modules/displayingFeature.module';
import {FormsFeatureModule} from '../../modules/formsFeature.module';

/**
 * Available sections for user settings
 */
enum UserSettingsSections
{
    /**
     * General user settings
     */
    General,

    /**
     * Loggers settings
     */
    Logging,

    /**
     * Debugging settings
     */
    Debugging
}

interface SettingsLoggingEnum
{
    /**
     * Minimal log level for console sink
     */
    consoleLogLevel: LogEventLevel;
}

/**
 * User settings component
 */
@Component(
{
    selector: 'user-settings',
    templateUrl: 'userSettings.component.html',
    styleUrls: ['userSettings.component.scss'],
    standalone: true,
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsSAComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Array of available themes
     */
    public themes: string[] = config.configuration.themes;

    /**
     * Array of language definitions
     */
    public languages: LanguageDef[] = config.configuration.languages;

    /**
     * Available log levels
     */
    public logLevels: ValueNamePair[] = [];

    /**
     * Form group for general settings
     */
    public generalSettingsForm: FormGroup;

    /**
     * Form group for debugging settings
     */
    public debuggingSettingsForm: FormGroup;

    /**
     * Form group for logging settings
     */
    public loggingSettingsForm: FormGroup;

    /**
     * Active section
     */
    public activeSection: UserSettingsSections = UserSettingsSections.General;

    /**
     * User settings section enum
     */
    public UserSettingsSections = UserSettingsSections;

    //######################### constructors #########################
    constructor(settingsSvc: SettingsService,
                formBuilder: FormBuilder,
                consoleConfig: ConsoleSinkConfigService,
                debugDataEnabled: DebugDataEnabledService)
    {
        const settings = settingsSvc.settings;
        const debuggingSettings = settingsSvc.settingsDebugging;
        const loggingSettings = settingsSvc.settingsLogging;
        
        this._getLogLevels();

        this.generalSettingsForm = formBuilder.group(
        <SettingsGeneral>
        {
            language: settings.language,
            theme: settings.theme
        });

        this.debuggingSettingsForm = formBuilder.group(
        <SettingsDebug>
        {
            consoleEnabled: debuggingSettings.consoleEnabled,
            debugData: debuggingSettings.debugData
        });

        this.loggingSettingsForm = formBuilder.group(
        <SettingsLoggingEnum>
        {
            consoleLogLevel: LogEventLevel[loggingSettings.consoleLogLevel as keyof typeof LogEventLevel],
        });

        this.generalSettingsForm.valueChanges.subscribe((generalSettings: SettingsGeneral) =>
        {
            settingsSvc.setSettings(generalSettings);
        });

        this.debuggingSettingsForm.valueChanges.subscribe((debugSettings: SettingsDebug) =>
        {
            debugDataEnabled.setEnabled(debugSettings.debugData);

            settingsSvc.setDebuggingSettings(debugSettings);
        });
        
        this.loggingSettingsForm.valueChanges.subscribe((loggingSettings: SettingsLoggingEnum) =>
        {
            consoleConfig.restrictToLevel = +loggingSettings.consoleLogLevel;

            settingsSvc.setLoggingSettings(
            {
                consoleLogLevel: LogEventLevel[+loggingSettings.consoleLogLevel],
            });
        });
    }

    //######################### private methods #########################

    /**
     * Gets available log levels
     */
    private _getLogLevels(): void
    {
        Object.keys(LogEventLevel).forEach(val =>
        {
            const numVal = +val;

            if(!isNaN(numVal))
            {
                this.logLevels.push(
                {
                    name: LogEventLevel[numVal],
                    value: val
                });
            }
        });
    }
}