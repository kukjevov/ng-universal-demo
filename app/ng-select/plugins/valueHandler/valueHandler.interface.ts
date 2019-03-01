import {InjectionToken, EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin, OptionsGatherer, CompareValueFunc} from "../../misc";
import {NgSelectOption} from "../../components/option";

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
    /**
     * Indication that multiple values can be selected
     */
    multiple?: boolean;
}

/**
 * Value handler plugin interface
 */
export interface ValueHandler<TValue> extends NgSelectPlugin
{
    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Function of value comparer that is used for comparison of values
     */
    valueComparer: CompareValueFunc<TValue>;

    /**
     * Current selected options of NgSelect
     */
    readonly selectedOptions: NgSelectOption<TValue>|NgSelectOption<TValue>[];

    /**
     * Current selected value of NgSelect
     */
    readonly value: TValue|TValue[];

    /**
     * Occurs when value of NgSelect changes
     */
    readonly valueChange: EventEmitter<void>;

    /**
     * Occurs when there is requested for change of visibility of popup using keyboard
     */
    readonly popupVisibilityRequest: EventEmitter<boolean>;

    /**
     * Sets value for NgSelect
     * @param value Value to be set
     */
    setValue(value:TValue|TValue[]): void;
}