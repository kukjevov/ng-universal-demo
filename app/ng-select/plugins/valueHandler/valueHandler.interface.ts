import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing value handler plugin in NgSelect
 */
export const VALUE_HANDLER = "VALUE_HANDLER";

/**
 * Token for injecting options for value handler plugin
 */
export const VALUE_HANDLER_OPTIONS: InjectionToken<ValueHandlerOptions> = new InjectionToken<ValueHandlerOptions>('VALUE_HANDLER_OPTIONS');

/**
 * Options for value handler plugin
 */
export interface ValueHandlerOptions extends PluginOptions
{
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler extends NgSelectPlugin
{
}