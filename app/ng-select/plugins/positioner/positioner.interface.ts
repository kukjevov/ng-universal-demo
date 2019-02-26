import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing positioner plugin in NgSelect
 */
export const POSITIONER = "POSITIONER";

/**
 * Token for injecting options for positioner plugin
 */
export const POSITIONER_OPTIONS: InjectionToken<PositionerOptions> = new InjectionToken<PositionerOptions>('POSITIONER_OPTIONS');

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
}

/**
 * Positioner plugin interface
 */
export interface Positioner extends NgSelectPlugin
{
}