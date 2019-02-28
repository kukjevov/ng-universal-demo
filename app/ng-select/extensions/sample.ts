import {NgSelectAction} from "../components/select";

/**
 * Sample action, TODO rewrite it to something meaningful
 */
export function sample<TValue>(): NgSelectAction<TValue>
{
    return ngSelect =>
    {
        console.log(ngSelect);
        // let bodyContentRenderer = ngSelect.getPlugin(BODY_CONTENT_RENDERER);

        // bodyContentRenderer.invalidateVisuals();
    };
}