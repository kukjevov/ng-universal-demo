import {InjectionToken, TemplateRef, EventEmitter} from "@angular/core";

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
 * Texts that are used within NormalState
 */
export interface NormalStateTexts
{
    /**
     * Displayed when there is no value selected, represents empty value, used if value is null or empty array
     */
    nothingSelected?: string;
}

/**
 * Options for normal state plugin
 */
export interface NormalStateOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Texts that are used within any NormalState
     */
    texts?: NormalStateTexts;

    /**
     * Template that is used within NormalState
     */
    template?: TemplateRef<NormalStateContext>;

    /**
     * Indication whether NgSelect should be in readonly state
     */
    readonly?: boolean;
}

/**
 * Normal state plugin interface
 */
export interface NormalState extends NgSelectPlugin
{
    /**
     * Occurs when user tries to toggle popup (open options)
     */
    togglePopup: EventEmitter<void>;
}

/**
 * Context for template that is used within normal state plugin
 */
export interface NormalStateContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: NormalState;
}