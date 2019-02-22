import {TemplateRef} from "@angular/core";

import {NgSelectComponent} from "./ngSelect.component";
import {OptionComponent} from "./option/option.component";
import {OptionsAndValueManager, CompareValueFunc, GetOptionsCallback} from "../misc/optionsAndValueManager.interface";

/**
 * Css classes used within NgSelect
 */
export interface NgSelectCssClasses
{
}

/**
 * NgSelect template context
 */
export interface NgSelectTemplateContext<TValue>
{
    /**
     * Implicit value for templates
     */
    $implicit: NgSelectComponent<TValue>;
}

/**
 * NgSelect Option template context
 */
export interface NgSelectOptionTemplateContext<TValue>
{
    /**
     * Implicit value for option templates
     */
    $implicit: OptionComponent<TValue>;

    /**
     * Instance of ng select
     */
    select: NgSelectComponent<TValue>;
}

/**
 * Public api used for communication with NgSelect
 */
export interface NgSelectApi<TValue>
{
    /**
     * Gets options and value manager, used for handling options and selected value
     */
    readonly optionsAndValueManager: OptionsAndValueManager<TValue>;

    /**
     * Coordinates of options pop relative to select
     */
    optionsCoordinates: Positions.PositionsCoordinates;

    /**
     * Coordinates of select relative to options
     */
    selectCoordinates: Positions.PositionsCoordinates;

    /**
     * Nothing selected text
     */
    nothingSelectedText: string;

    /**
     * Method used for comparision of selected value and options
     */
    valueComparer: CompareValueFunc<TValue>;

    /**
     * Method used for obtaining options
     */
    optionsObtainer: GetOptionsCallback<TValue>;

    /**
     * Currently selected value
     */
    readonly value: TValue|Array<TValue>;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals();
}

/**
 * Public api used for extending NgSelect
 */
export interface NgSelectCustomize<TValue> extends NgSelectApi<TValue>
{
    /**
     * Indication whether is options div visible
     */
    optionsDivVisible: boolean;

    /**
     * Computed coordinates of optionsDiv
     */
    optionsDivStyle: Positions.PositionsCss;

    /**
     * Indication whether select should behave as multiselect
     */
    multiselect: boolean;

    /**
     * Template used for main look customization
     */
    look: TemplateRef<NgSelectTemplateContext<TValue>>;

    /**
     * Template used for options div look customization
     */
    optionsDivLook: TemplateRef<NgSelectTemplateContext<TValue>>;

    /**
     * Template used for option look customization
     */
    optionLook: TemplateRef<NgSelectOptionTemplateContext<TValue>>;

    /**
     * Template used for option text look customization
     */
    optionTextLook: TemplateRef<NgSelectOptionTemplateContext<TValue>>;

    /**
     * Toggles options div visibility
     */
    toggleOptionsDiv();
}