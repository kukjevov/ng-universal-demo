import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin, OptionsGatherer} from "../../misc";

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
    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<any>;

    /**
     * HTML element that represents select itself
     */
    selectElement: HTMLElement;
}