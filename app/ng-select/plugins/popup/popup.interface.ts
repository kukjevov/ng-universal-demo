import {InjectionToken, EventEmitter, TemplateRef} from "@angular/core";

import {NgSelectPlugin, VisualPluginOptions, OptionsGatherer} from "../../misc";
import {NgSelectOption} from "../../components/option";

/**
 * Constant used for accessing popup plugin in NgSelect
 */
export const POPUP = "POPUP";

/**
 * Token for injecting options for popup plugin
 */
export const POPUP_OPTIONS: InjectionToken<PopupOptions<any>> = new InjectionToken<PopupOptions<any>>('POPUP_OPTIONS');

/**
 * Options for popup plugin
 */
export interface PopupOptions<TCssClasses> extends VisualPluginOptions<TCssClasses>
{
    /**
     * Indication whether are popup options visible, or not
     */
    visible?: boolean;

    /**
     * Indication that multiple values can be selected
     */
    multiple?: boolean;

    /**
     * Template that is used within NormalState as option
     */
    optionTemplate?: TemplateRef<PopupContext>;
}

/**
 * Popup plugin interface
 */
export interface Popup<TValue> extends NgSelectPlugin
{
    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    readonly optionClick: EventEmitter<NgSelectOption<TValue>>;

    /**
     * Occurs when visibility of popup has changed
     */
    readonly visibilityChange: EventEmitter<void>;
}

/**
 * Context for template that is used within popup plugin
 */
export interface PopupContext
{
    /**
     * Instance of plugin itself
     */
    $implicit: NgSelectOption<any>;

    /**
     * Instance of plugin itself
     */
    popup: Popup<any>;
}