import {ValueHandler, ValueHandlerOptions} from "../valueHandler.interface";

/**
 * Basic value handler options
 */
export interface BasicValueHandlerOptions extends ValueHandlerOptions
{
}

/**
 * Public API for 'BasicValueHandlerComponent'
 */
export interface BasicValueHandler<TValue> extends ValueHandler<TValue>
{
}