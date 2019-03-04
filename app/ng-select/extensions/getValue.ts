import {NgSelectFunction} from "../components/select";
import {VALUE_HANDLER, ValueHandler} from "../plugins/valueHandler";

/**
 * Gets current value of NgSelect
 */
export function getValue<TValue>(): NgSelectFunction<TValue|TValue[], TValue>
{
    return ngSelect =>
    {
        let valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        return valueHandler.value;
    };
}