import {Injectable} from '@angular/core';
import {RESTClient, BaseUrl, DefaultHeaders, POST, JsonContentType, Body, DisableInterceptor, ParameterTransform, DisableMiddleware} from '@anglr/rest';
import {LoggerRestClient, RestLog} from '@anglr/common/structured-log';
import {AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {ClientErrorHandlingMiddleware} from '@anglr/error-handling/rest';
import {EMPTY, NEVER, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {config} from '../../../config';
import version from '../../../../config/version.json';

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
    @DisableMiddleware(ClientErrorHandlingMiddleware)
    @DisableInterceptor(AuthInterceptor)
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('logger')
    public _log(@Body @ParameterTransform('_unhandledErrorsTransform') _logs: RestLog[]): Observable<void>
    {
        return NEVER;
    }

    //######################### private methods #########################

    /**
     * Removes unhandled error text from logs
     * @param logs - Logs to be transformed
     */
    //@ts-ignore
    private _unhandledErrorsTransform(logs: RestLog[]): RestLog[]
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

            //remove unhandled error message and serialize
            if(obj.message.startsWith('Unhandled error: '))
            {
                const message = obj.message.replace('Unhandled error: ', '');

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
}