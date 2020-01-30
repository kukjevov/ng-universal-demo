import {StringDictionary} from "@jscrpt/common";
import {WebSocketClientResponse} from "@anglr/rest/stompjs";
import {Observable, forkJoin, of} from "rxjs";

import {KodPopisValue} from "../../misc/types";

/**
 * Gets observable then will returns response objects for keys
 * @param keyObj Object storing codes
 * @param responseCallback Callback used for obtaining single response
 * @param resultCallback Callback used for obtaining observable from output queue
 * @param webSocketResponses Array of created websocket responses
 */
export function getCodeObservable<TQueue, TResult>(keyObj: StringDictionary,
                                                   responseCallback: (kod: string) => WebSocketClientResponse<TQueue>,
                                                   resultCallback: (output: TQueue) => Observable<TResult>,
                                                   webSocketResponses: WebSocketClientResponse<any>[]): Observable<TResult[]>
{
    let obs = Object.keys(keyObj).map(kod =>
    {
        let response = responseCallback(kod);
        webSocketResponses.push(response);

        return resultCallback(response.output);
    });

    return obs.length ? forkJoin(obs) : of([]);
}

/**
 * Class used for static utility misc methods
 */
export class Misc
{
    /**
     * Transforms all first level properties to 'kod' and their values to 'popis' array
     * @param {any} obj Object to be transformed
     */
    public static transformObjectToKodPopisValue(obj: any): KodPopisValue[]
    {
        let result: KodPopisValue[] = [];

        if(obj)
        {
            Object.keys(obj).forEach(prop =>
            {
                result.push(
                {
                    kod: prop,
                    popis: obj[prop]
                });
            });
        }

        return result;
    }
}