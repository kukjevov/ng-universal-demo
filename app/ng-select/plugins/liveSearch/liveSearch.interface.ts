import {InjectionToken, EventEmitter} from "@angular/core";

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
 * Texts that are used within LiveSearch
 */
export interface LiveSearchTexts
{
    /**
     * Displayed when nothing was entered into input
     */
    inputPlaceholder?: string;
}

/**
 * Options for live search plugin
 */
export interface LiveSearchOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Texts that are used within any LiveSearch
     */
    texts?: LiveSearchTexts;
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

    /**
     * Current value of live search
     */
    readonly searchValue: string;

    /**
     * Occurs when current value of live search changes
     */
    readonly searchValueChange: EventEmitter<void>;
}