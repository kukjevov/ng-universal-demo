import {Injectable} from '@angular/core';
import {RESTClient, GET, ResponseType, Produces, BaseUrl, DefaultHeaders, QueryObject} from '@anglr/rest';

import {GridItem} from "./gridData.interface";
import {PagedData, Pageable} from "../../../misc/types";
import {Observable} from 'rxjs';
import * as global from 'config/global';

/**
 * Service used to access grid data
 **/
@Injectable()
@BaseUrl(global.apiBaseUrl)
@DefaultHeaders(global.defaultApiHeaders)
export class GridDataService extends RESTClient
{
    //######################### public methods #########################
    
    /**
     * Gets grid data
     */
    @Produces(ResponseType.Json)
    @GET("grid-data")
    public getGridData(@QueryObject paging: Pageable): Observable<PagedData<GridItem>>
    {
        return null;
    }
}