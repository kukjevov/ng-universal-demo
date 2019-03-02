import {InjectionToken, Type} from "@angular/core";

import {NgSelectPluginTypes} from "./plugin.interface";
import {KeyboardHandler} from "../plugins/keyboardHandler";
import {NormalState} from "../plugins/normalState";
import {Popup} from "../plugins/popup";
import {Positioner} from "../plugins/positioner";
import {ReadonlyState} from "../plugins/readonlyState";
import {ValueHandler} from "../plugins/valueHandler";
import {LiveSearch} from "../plugins/liveSearch";
import {TextsLocator} from "../plugins/textsLocator";
import {OptionsGatherer} from "./optionsGatherer/optionsGatherer.interface";
import {TemplateGatherer} from "./templateGatherer.interface";
import {NgSelectOption} from "../components/option";

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
export const POPUP_TYPE: InjectionToken<Type<Popup>> = new InjectionToken<Type<Popup>>('POPUP_TYPE');

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
export const VALUE_HANDLER_TYPE: InjectionToken<Type<ValueHandler<any>>> = new InjectionToken<Type<ValueHandler<any>>>('VALUE_HANDLER_TYPE');

/**
 * Injection token for 'LiveSearch' implementation
 */
export const LIVE_SEARCH_TYPE: InjectionToken<Type<LiveSearch>> = new InjectionToken<Type<LiveSearch>>('LIVE_SEARCH_TYPE');

/**
 * Injection token for 'TextsLocator' implementation
 */
export const TEXTS_LOCATOR_TYPE: InjectionToken<Type<TextsLocator>> = new InjectionToken<Type<TextsLocator>>('TEXTS_LOCATOR_TYPE');

/**
 * Function used for comparing two values
 */
export interface CompareValueFunc<TValue>
{
    /**
     * Compares two values and returns true if objects are equal, otherwise false
     * @param source First value to be compared
     * @param target Second value to be compared
     */
    (source: TValue, target: TValue): boolean;
}

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

    /**
     * Instance of template gatherer used for obtaining custom templates
     */
    templateGatherer?: TemplateGatherer;

    /**
     * Indication whether is NgSelect readonly or not
     */
    readonly?: boolean;

    /**
     * Function of value comparer that is used for comparison of values
     */
    valueComparer?: CompareValueFunc<TValue>;

    /**
     * Method that is used for filtering when live search is running on static data
     */
    liveSearchFilter?: (query: string) => (option: NgSelectOption<TValue>) => boolean;
}