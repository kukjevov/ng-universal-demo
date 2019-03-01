import {NormalState, NormalStateOptions} from "../normalState.interface";

/**
 * Css classes for basic normal state
 */
export interface CssClassesBasicNormalState
{
    /**
     * Applied to currently selected value, which is visible to user (default template)
     */
    selectedValue?: string;

    /**
     * Applied to "carret", indicating that it is select and there is more options available
     */
    selectedCarret?: string;

    /**
     * Applied to HTML element that represents normal default state visible to user
     */
    normalStateElement?: string;
}

/**
 * Basic normal state options
 */
export interface BasicNormalStateOptions extends NormalStateOptions<CssClassesBasicNormalState>
{
}

/**
 * Public API for 'BasicNormalStateComponent'
 */
export interface BasicNormalState extends NormalState
{
}