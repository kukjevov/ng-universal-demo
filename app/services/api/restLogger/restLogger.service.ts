import {Injectable} from '@angular/core';
import {RESTClient, BaseUrl, DefaultHeaders, POST, JsonContentType, Body, DisableInterceptor} from '@anglr/rest';
import {LoggerRestClient, RestLog} from '@anglr/common/structured-log';
import {HttpErrorInterceptor} from '@anglr/error-handling';
import {AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {Observable} from 'rxjs';

import {config} from '../../../config';

/**
 * Service used for logging logs on server
 */
@Injectable()
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class RestLoggerService extends RESTClient implements LoggerRestClient
{
    //######################### public methods - implementation of LoggerRestClient #########################

    /**
     * Logs message on server using REST
     * @param logs - Array of logs to be logged
     */
    @JsonContentType()
    @DisableInterceptor(HttpErrorInterceptor)
    @DisableInterceptor(AuthInterceptor)
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('logger')
    public log(@Body _logs: RestLog[]): Observable<void>
    {
        return null;
    }
}