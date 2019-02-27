import {NormalState, NormalStateOptions} from "../normalState.interface";

/**
 * Css classes for basic normal state
 */
export interface CssClassesBasicNormalState
{
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