import {Injectable} from '@angular/core';
import {RESTClient, GET, BaseUrl, DefaultHeaders, Query} from '@anglr/rest';
import * as global from 'config/global';

import {Data} from "./data.interface";
import {Observable} from 'rxjs';
import {PagedData, KodPopisValue} from "../../../misc/types";

/**
 * Service used to access sample data
 **/
@Injectable()
@BaseUrl(global.apiBaseUrl)
@DefaultHeaders(global.defaultApiHeaders)
export class DataService extends RESTClient
{
    //######################### public methods #########################
    
    /**
     * Gets data
     */
    @GET("data")
    public getData(): Observable<Data>
    {
        return null;
    }

    /**
     * Gets cis
     */
    @GET("cis")
    public getCis(@Query('search') query: string, @Query('size') size: number): Observable<PagedData<KodPopisValue>>
    {
        return null;
    }

    /**
     * Gets long call 5 min
     */
    @GET("longcall")
    public longCall(): Observable<void>
    {
        return null;
    }

    /**
     * Gets continue response
     */
    @GET("continue")
    public continue(): Observable<void>
    {
        return null;
    }
}