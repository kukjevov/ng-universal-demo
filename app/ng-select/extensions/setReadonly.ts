import {NgSelectAction} from "../components/select";

/**
 * Sets NgSelect as readonly, non editable
 * @param readonly Indication whether is select readonly or not, if omitted defaults to true
 */
export function setReadonly<TValue>(readonly: boolean = true): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        ngSelect.selectOptions =
        {
            readonly: readonly
        };

        if(ngSelect.isInitialized)
        {
            ngSelect.initOptions();
            ngSelect.initialize();
        }
    };
}