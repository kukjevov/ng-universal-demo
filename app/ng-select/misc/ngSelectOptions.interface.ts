import {InjectionToken, Type} from "@angular/core";

import {NgSelectPluginTypes} from "./plugin.interface";
import {KeyboardHandler} from "../plugins/keyboardHandler";
import {NormalState} from "../plugins/normalState";
import {Popup} from "../plugins/popup";
import {Positioner} from "../plugins/positioner";
import {ReadonlyState} from "../plugins/readonlyState";
import {ValueHandler} from "../plugins/valueHandler";
import {LiveSearch} from "../plugins/liveSearch";
import {OptionsGatherer} from "./optionsGatherer.interface";
import {TextsLocator} from "../plugins/textsLocator";

/**
 * Injection token for 'NgSelectOptions'
 */
export const NG_SELECT_OPTIONS: InjectionToken<NgSelectOptions<any>> = new InjectionToken<NgSelectOptions<any>>('NG_SELECT_OPTIONS');

/**
 * Injection token for 'KeyboardHandler' implementation
 */
export const KEYBOARD_HANDLER_TYPE: InjectionToken<Type<KeyboardHandler>> = new InjectionToken<Type<KeyboardHandler>>('KEYBOARD_HANDLER_TYPE');

/**
 * Injection token for 'NormalState' implementation
 */
export const NORMAL_STATE_TYPE: InjectionToken<Type<NormalState>> = new InjectionToken<Type<NormalState>>('NORMAL_STATE_TYPE');

/**
 * Injection token for 'Popup' implementation
 */
export const POPUP_TYPE: InjectionToken<Type<Popup<any>>> = new InjectionToken<Type<Popup<any>>>('POPUP_TYPE');

/**
 * Injection token for 'Positioner' implementation
 */
export const POSITIONER_TYPE: InjectionToken<Type<Positioner>> = new InjectionToken<Type<Positioner>>('POSITIONER_TYPE');

/**
 * Injection token for 'ReadonlyState' implementation
 */
export const READONLY_STATE_TYPE: InjectionToken<Type<ReadonlyState>> = new InjectionToken<Type<ReadonlyState>>('READONLY_STATE_TYPE');

/**
 * Injection token for 'ValueHandler' implementation
 */
export const VALUE_HANDLER_TYPE: InjectionToken<Type<ValueHandler>> = new InjectionToken<Type<ValueHandler>>('VALUE_HANDLER_TYPE');

/**
 * Injection token for 'LiveSearch' implementation
 */
export const LIVE_SEARCH_TYPE: InjectionToken<Type<LiveSearch>> = new InjectionToken<Type<LiveSearch>>('LIVE_SEARCH_TYPE');

/**
 * Injection token for 'TextsLocator' implementation
 */
export const TEXTS_LOCATOR_TYPE: InjectionToken<Type<TextsLocator>> = new InjectionToken<Type<TextsLocator>>('TEXTS_LOCATOR_TYPE');

/**
 * Describes select options used for NgSelect
 */
export interface NgSelectOptions<TValue>
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

    /**
     * Instance of options gatherer that is used for obtaining options
     */
    optionsGatherer?: OptionsGatherer<TValue>;
}