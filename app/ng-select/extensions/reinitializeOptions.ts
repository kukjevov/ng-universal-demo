import {NgSelectAction} from "../components/select";
import {NgSelectOptions} from "../misc";

/**
 * Method reinitialize options for NgSelect
 * @param {NgSelectOptions} options Options to be used for reinitialization
 */
export function reinitializeOptions<TValue>(options?: NgSelectOptions<TValue>): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        if(options)
        {
            ngSelect.selectOptions = options;
        }

        ngSelect.initOptions();
        ngSelect.invalidateVisuals();
        ngSelect.initialize();
    };
}