import {InjectionToken, Type} from "@angular/core";

import {NgSelectPluginTypes} from "./plugin.interface";

/**
 * Injection token for 'NgSelectOptions'
 */
export const NG_SELECT_OPTIONS: InjectionToken<NgSelectOptions> = new InjectionToken<NgSelectOptions>('NG_SELECT_OPTIONS');

/**
 * Injection token for 'KeyboardHandler' implementation
 */
export const KEYBOARD_HANDLER_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('KEYBOARD_HANDLER_TYPE');

/**
 * Injection token for 'NormalState' implementation
 */
export const NORMAL_STATE_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('NORMAL_STATE_TYPE');

/**
 * Injection token for 'Popup' implementation
 */
export const POPUP_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('POPUP_TYPE');

/**
 * Injection token for 'Positioner' implementation
 */
export const POSITIONER_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('POSITIONER_TYPE');

/**
 * Injection token for 'ReadonlyState' implementation
 */
export const READONLY_STATE_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('READONLY_STATE_TYPE');

/**
 * Injection token for 'ValueHandler' implementation
 */
export const VALUE_HANDLER_TYPE: InjectionToken<Type<any>> = new InjectionToken<Type<any>>('VALUE_HANDLER_TYPE');

/**
 * Describes select options used for NgSelect
 */
export interface NgSelectOptions
{
    /**
     * Indication whether NgSelect should be initialized automaticaly during 'NgOnInit' phase
     */
    autoInitialize?: boolean;

    /**
     * Css classes applied to ng select component, possible to override only part of classes
     */
    cssClasses?: {};

    /**
     * Object defining overrides for default plugins, default plugins can be also specified using DI
     */
    plugins?: NgSelectPluginTypes;
}