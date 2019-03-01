import {NgSelectAction} from "../components/select";
import {VALUE_HANDLER, ValueHandler} from "../plugins/valueHandler";

/**
 * Sets value of NgSelect
 * @param value Value to be set into select
 */
export function setValue<TValue>(value: TValue|TValue[]): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        let valueHandler = ngSelect.getPlugin(VALUE_HANDLER) as ValueHandler<TValue>;

        valueHandler.setValue(value);
    };
}