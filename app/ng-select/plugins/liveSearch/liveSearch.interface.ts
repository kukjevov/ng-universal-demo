import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing live search plugin in NgSelect
 */
export const LIVE_SEARCH = "LIVE_SEARCH";

/**
 * Token for injecting options for live search plugin
 */
export const LIVE_SEARCH_OPTIONS: InjectionToken<LiveSearchOptions> = new InjectionToken<LiveSearchOptions>('LIVE_SEARCH_OPTIONS');

/**
 * Options for live search plugin
 */
export interface LiveSearchOptions extends PluginOptions
{
}

/**
 * Keyboard handler plugin interface
 */
export interface LiveSearch extends NgSelectPlugin
{
}