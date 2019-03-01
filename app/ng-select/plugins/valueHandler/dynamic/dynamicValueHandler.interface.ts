import {ValueHandler, ValueHandlerOptions} from "../valueHandler.interface";

/**
 * Dynamic value handler options
 */
export interface DynamicValueHandlerOptions extends ValueHandlerOptions
{
}

/**
 * Public API for 'DynamicValueHandlerComponent'
 */
export interface DynamicValueHandler<TValue> extends ValueHandler<TValue>
{
}