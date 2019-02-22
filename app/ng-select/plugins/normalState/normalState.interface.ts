import {InjectionToken} from "@angular/core";

import {PluginOptions} from "../../misc";

/**
 * Constant used for accessing normal state plugin in NgSelect
 */
export const NORMAL_STATE = "NORMAL_STATE";

/**
 * Token for injecting options for normal state plugin
 */
export const NORMAL_STATE_OPTIONS: InjectionToken<NormalStateOptions> = new InjectionToken<NormalStateOptions>('NORMAL_STATE_OPTIONS');

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions extends PluginOptions
{
}

/**
 * Normal state plugin interface
 */
export interface NormalState
{
}