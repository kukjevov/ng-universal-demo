import {InjectionToken} from "@angular/core";

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
export interface NgSelect
{
    /**
     * Gets or sets NgSelect options
     */
    selectOptions: NgSelectOptions;

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    initialize();

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize GridOptions
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
}