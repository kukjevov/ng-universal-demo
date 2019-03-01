import {InjectionToken} from "@angular/core";
import {Observable} from "rxjs";

import {NgSelectPlugin, NgSelectOptions} from "../../misc";

/**
 * Token used for obtaining 'NgSelectPluginInstances'
 */
export const NG_SELECT_PLUGIN_INSTANCES: InjectionToken<NgSelectPluginInstances> = new InjectionToken<NgSelectPluginInstances>('NG_SELECT_PLUGIN_INSTANCES');

/**
 * Interface describing object storing all existing plugin instances for NgSelect
 */
export interface NgSelectPluginInstances
{
    [pluginName: string]: NgSelectPlugin;
}

/**
 * Public API for NgSelect
 */
export interface NgSelect<TValue>
{
    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    readonly initialized: Observable<boolean>;

    /**
     * Gets current state of initialization
     */
    readonly isInitialized: boolean;

    /**
     * Gets or sets NgSelect options
     */
    selectOptions: NgSelectOptions<TValue>;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initialize();

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    initOptions();

    /**
     * Gets instance of plugin by its id
     * @param {string} pluginId Id of plugin, use constants
     */
    getPlugin<PluginType extends NgSelectPlugin>(pluginId: string): PluginType;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;

    /**
     * Executes actions on NgSelect
     * @param actions Array of actions that are executed over NgSelect
     */
    execute(...actions: NgSelectAction<TValue>[]);

    /**
     * Executes function on NgSelect and returns result
     * @param func Function that is executed and its result is returned
     */
    executeAndReturn<TResult>(func: NgSelectFunction<TResult, TValue>): TResult;
}

/**
 * Defintion of action that can be executed on NgSelect
 */
export type NgSelectAction<TValue> = (ngSelect: NgSelect<TValue>) => void;

/**
 * Definition of function that can be executed on NgSelect and returns some data
 */
export type NgSelectFunction<TResult, TValue> = (ngSelect: NgSelect<TValue>) => TResult;