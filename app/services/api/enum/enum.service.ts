import {Injectable} from '@angular/core';
import {GET, BaseUrl, DefaultHeaders, Path, ResponseTransform, Cache, QueryObject, RESTClient} from '@anglr/rest';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as global from 'config/global';

import {PriznakPoistenec} from "./enum.interface";
import {KodPopisValue} from "../../../misc/types";
import {Misc} from '../misc.static';


/**
 * Service used to access enums
 */
@Injectable()
@BaseUrl(`${global.apiBaseUrl}enum/`)
@DefaultHeaders(global.defaultApiHeaders)
export class EnumService extends RESTClient
{
    //######################### public methods #########################

    /**
     * Gets enum of priznaky poistenec
     * @returns Observable
     */
    @GET("priznakypoistenec")
    public getPriznakyPoistenec(): Observable<PriznakPoistenec[]>
    {
        return null;
    }

    /**
     * Gets enum of specified type
     * @returns Observable
     */
    @Cache()
    @ResponseTransform()
    @GET("{type}")
    public getEnum(@Path('type') type: string, @QueryObject _additionalData?: Object): Observable<KodPopisValue[]>
    {
        return null;
    }

    /**
     * Gets enum of specified type, from objects containing popis, kratkyPopis
     * @returns Observable
     */
    @Cache()
    @ResponseTransform()
    @GET("{type}")
    public getEnumPopis(@Path('type') type: string, @QueryObject _additionalData?: Object): Observable<KodPopisValue[]>
    {
        return null;
    }

    /**
     * Gets enum of specified type as object
     * @returns Observable
     */
    @Cache()
    @GET("{type}")
    public getEnumObj(@Path('type') type: string, @QueryObject _additionalData?: Object): Observable<{[key: string]: any}>
    {
        return null;
    }

    /**
     * Gets enum of 'okres'
     * @param {string} krajKod Code of 'kraj'
     */
    @ResponseTransform()
    @GET("okres/{kraj}")
    public getOkres(@Path('kraj') krajKod: string): Observable<KodPopisValue[]>
    {
        return null;
    }

    /**
     * Transform response from getEnumPopis method
     */
    //@ts-ignore
    private getEnumPopisResponseTransform(response: Observable<any[]>): Observable<KodPopisValue[]>
    {
        return response.pipe(map(result =>
        {
            let $return: KodPopisValue[] = [];

            if(result)
            {
                Object.keys(result).forEach(prop =>
                {
                    $return.push(
                    {
                        kod: prop,
                        popis: result[prop].kratkyPopis || result[prop].popis
                    });
                });
            }

            return $return;
        }));
    }

    /**
     * Transform response from getEnum method
     */
    //@ts-ignore
    private getEnumResponseTransform(response: Observable<KodPopisValue[]>): Observable<KodPopisValue[]>
    {
        return response.pipe(map(Misc.transformObjectToKodPopisValue));
    }

    /**
     * Transform response from getEnum method
     */
    //@ts-ignore
    private getOkresResponseTransform(response: Observable<KodPopisValue[]>): Observable<KodPopisValue[]>
    {
        return response.pipe(map(Misc.transformObjectToKodPopisValue));
    }
}
