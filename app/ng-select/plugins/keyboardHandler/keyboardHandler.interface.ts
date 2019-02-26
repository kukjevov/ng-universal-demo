import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing keyboard handler plugin in NgSelect
 */
export const KEYBOARD_HANDLER = "KEYBOARD_HANDLER";

/**
 * Token for injecting options for keyboard handler plugin
 */
export const KEYBOARD_HANDLER_OPTIONS: InjectionToken<KeyboardHandlerOptions> = new InjectionToken<KeyboardHandlerOptions>('KEYBOARD_HANDLER_OPTIONS');

/**
 * Options for keyboard handler plugin
 */
export interface KeyboardHandlerOptions extends PluginOptions
{
}

/**
 * Keyboard handler plugin interface
 */
export interface KeyboardHandler extends NgSelectPlugin
{
}