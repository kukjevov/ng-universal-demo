import {InjectionToken} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions} from "../../misc";

/**
 * Constant used for accessing live search plugin in NgSelect
 */
export const LIVE_SEARCH = "LIVE_SEARCH";

/**
 * Token for injecting options for live search plugin
 */
export const LIVE_SEARCH_OPTIONS: InjectionToken<LiveSearchOptions<any>> = new InjectionToken<LiveSearchOptions<any>>('LIVE_SEARCH_OPTIONS');

/**
 * Options for live search plugin
 */
export interface LiveSearchOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
}

/**
 * Keyboard handler plugin interface
 */
export interface LiveSearch extends NgSelectPlugin
{
    /**
     * HTML element that represents live search
     */
    readonly liveSearchElement: HTMLElement;
}