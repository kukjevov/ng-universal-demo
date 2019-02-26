import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing popup plugin in NgSelect
 */
export const POPUP = "POPUP";

/**
 * Token for injecting options for popup plugin
 */
export const POPUP_OPTIONS: InjectionToken<PopupOptions> = new InjectionToken<PopupOptions>('POPUP_OPTIONS');

/**
 * Options for popup plugin
 */
export interface PopupOptions extends PluginOptions
{
}

/**
 * Popup plugin interface
 */
export interface Popup extends NgSelectPlugin
{
}