import {ValueHandler, ValueHandlerOptions} from "../valueHandler.interface";
import {GetOptionsCallback} from "../../../misc";

/**
 * Dynamic value handler options
 */
export interface DynamicValueHandlerOptions<TValue> extends ValueHandlerOptions
{
    /**
     * Callback used for obtaining dynamic options during initialization, if not specified value will be used as text
     */
    dynamicOptionsCallback?: GetOptionsCallback<TValue>;

    /**
     * Used for obtaining displayed text from value, defaults to value itself, if dynamicOptionsCallback is specified this is not called
     */
    textExtractor?: (value: TValue) => string;
}

/**
 * Public API for 'DynamicValueHandlerComponent'
 */
export interface DynamicValueHandler<TValue> extends ValueHandler<TValue>
{
}