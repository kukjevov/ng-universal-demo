import {InjectionToken} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions} from "../../misc";

/**
 * Constant used for accessing normal state plugin in NgSelect
 */
export const NORMAL_STATE = "NORMAL_STATE";

/**
 * Token for injecting options for normal state plugin
 */
export const NORMAL_STATE_OPTIONS: InjectionToken<NormalStateOptions<any>> = new InjectionToken<NormalStateOptions<any>>('NORMAL_STATE_OPTIONS');

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
    //TODO - move into texts and create plugin for text
    nothingSelectedText?: string;
}

/**
 * Normal state plugin interface
 */
export interface NormalState extends NgSelectPlugin
{
}