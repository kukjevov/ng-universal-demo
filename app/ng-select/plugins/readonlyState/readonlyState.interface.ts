import {InjectionToken} from "@angular/core";

import {NormalStateOptions, NormalState} from "../normalState";

/**
 * Constant used for accessing readonly state plugin in NgSelect
 */
export const READONLY_STATE = "READONLY_STATE";

/**
 * Token for injecting options for readonly state plugin
 */
export const READONLY_STATE_OPTIONS: InjectionToken<ReadonlyStateOptions<any>> = new InjectionToken<ReadonlyStateOptions<any>>('READONLY_STATE_OPTIONS');

/**
 * Options for readonly state plugin
 */
export interface ReadonlyStateOptions<TCssClasses> extends NormalStateOptions<TCssClasses>
{
}

/**
 * Readonly state plugin interface
 */
export interface ReadonlyState extends NormalState
{
}