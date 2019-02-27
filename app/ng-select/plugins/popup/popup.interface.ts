import {InjectionToken} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions} from "../../misc";

/**
 * Constant used for accessing popup plugin in NgSelect
 */
export const POPUP = "POPUP";

/**
 * Token for injecting options for popup plugin
 */
export const POPUP_OPTIONS: InjectionToken<PopupOptions<any>> = new InjectionToken<PopupOptions<any>>('POPUP_OPTIONS');

/**
 * Options for popup plugin
 */
export interface PopupOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
}

/**
 * Popup plugin interface
 */
export interface Popup extends NgSelectPlugin
{
}