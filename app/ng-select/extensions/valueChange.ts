import {Subscription} from "rxjs";

import {NgSelectFunction} from "../components/select";
import {VALUE_HANDLER, ValueHandler} from "../plugins/valueHandler";

/**
 * Adds callback that is called when value changes and returns subscription for this changes
 */
export function valueChange<TValue>(callback: (value: TValue|TValue[]) => void): NgSelectFunction<Subscription, TValue>
{
    return ngSelect =>
    {
        let valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        return valueHandler.valueChange.subscribe(() => callback(valueHandler.value));
    };
}