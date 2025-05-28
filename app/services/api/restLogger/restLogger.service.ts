import {Injectable} from '@angular/core';
import {RESTClient, BaseUrl, DefaultHeaders, POST, JsonContentType, Body, DisableInterceptor, ParameterTransform, DisableMiddleware, LoggerMiddleware} from '@anglr/rest';
import {CatchHttpClientErrorMiddleware, HttpClientErrorProcessingMiddleware} from '@anglr/error-handling/rest';
import {AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {LoggerRestClient, RestLog} from '@anglr/common';
import {EMPTY, NEVER, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {config} from '../../../config';
import version from '../../../../config/version.json';

/**
 * Removes unhandled error text from logs
 */
function unhandledErrorsTransform(logs: RestLog[]): RestLog[]
{
    function addBasicInfo(log: {version?: string, id?: string})
    {
        if(!log)
        {
            return;
        }

        log.version = version.version;
        log.id = 'angular-gui';
    }

    for(let x = 0; x < logs.length; x++)
    {
        const obj: RestLog & {info?: any} = logs[x];
        let unhandledErrorIndex: number;

        //remove unhandled error message and serialize
        if((unhandledErrorIndex = obj.message.indexOf('Unhandled error: ')) >= 0)
        {
            const message = obj.message.substring(unhandledErrorIndex + 'Unhandled error: '.length);

            try
            {
                obj.info = JSON.parse(message);

                if(Array.isArray(obj.info))
                {
                    obj.info = obj.info[0];
                }

                addBasicInfo(obj.info);
            }
            catch
            {
                obj.info = {};

                addBasicInfo(obj.info);
            }
        }
        else
        {
            obj.info = {};

            addBasicInfo(obj.info);
        }

        logs[x] = obj;
    }

    return logs;
}

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
     * @inheritdoc
     */
    public log(logs: RestLog[]): Observable<void>
    {
        return this._log(logs)
            .pipe(catchError(_ =>
            {
                console.warn('Failed to create log on server');

                return EMPTY;
            }));
    }

    //######################### private methods #########################

    /**
     * Logs message on server using REST
     * @param logs - Array of logs to be logged
     */
    @JsonContentType()
    @DisableMiddleware(LoggerMiddleware)
    @DisableMiddleware(CatchHttpClientErrorMiddleware)
    @DisableMiddleware(HttpClientErrorProcessingMiddleware)
    @DisableInterceptor(AuthInterceptor)
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('logger')
    public _log(@Body @ParameterTransform(unhandledErrorsTransform) _logs: RestLog[]): Observable<void>
    {
        return NEVER;
    }
}
