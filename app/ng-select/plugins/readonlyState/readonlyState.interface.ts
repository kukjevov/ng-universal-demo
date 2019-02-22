import {InjectionToken} from "@angular/core";

import {PluginOptions} from "../../misc";

/**
 * Constant used for accessing readonly state plugin in NgSelect
 */
export const READONLY_STATE = "READONLY_STATE";

/**
 * Token for injecting options for readonly state plugin
 */
export const READONLY_STATE_OPTIONS: InjectionToken<ReadonlyStateOptions> = new InjectionToken<ReadonlyStateOptions>('READONLY_STATE_OPTIONS');

/**
 * Options for readonly state plugin
 */
export interface ReadonlyStateOptions extends PluginOptions
{
}

/**
 * Readonly state plugin interface
 */
export interface ReadonlyState
{
}