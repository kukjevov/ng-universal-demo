import {Injectable} from '@angular/core';
import {RESTClient, GET, BaseUrl, DefaultHeaders} from '@anglr/rest';
import {HttpClientErrorMessages} from '@anglr/error-handling/rest';
import {NEVER, Observable} from 'rxjs';

import {config} from '../../../config';

/**
 * Error test
 */
@Injectable()
@BaseUrl(`${config.configuration.apiBaseUrl}error/`)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class ErrorService extends RESTClient
{
    //######################### public methods #########################

    /**
     * Gets 400 test
     */
    @GET('400')
    public call400(): Observable<string>
    {
        return NEVER;
    }
    
    /**
     * Gets 400 test
     */
    @HttpClientErrorMessages({404: 'neni zmizlo'})
    @GET('404')
    public call404(): Observable<string>
    {
        return NEVER;
    }
}