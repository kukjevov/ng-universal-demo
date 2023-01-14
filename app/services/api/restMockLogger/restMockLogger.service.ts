import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {RESTClient, BaseUrl, DefaultHeaders, MockLogger, JsonContentType, DisableMiddleware, DisableInterceptor, POST, Body, MockLoggerMiddleware} from '@anglr/rest';
import {ClientErrorHandlingMiddleware} from '@anglr/error-handling/rest';
import {AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {isBlank, isString} from '@jscrpt/common';
import {lastValueFrom} from '@jscrpt/common/rxjs';
import {NEVER, Observable} from 'rxjs';

import {config} from '../../../config';

/**
 * Service for logging responses for mocks
 */
@Injectable()
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class RestMockLoggerService extends RESTClient implements MockLogger
{
    //######################### public methods #########################

    /**
     * @inheritdoc
     */
    public async logResponse(request: HttpRequest<unknown>, response: HttpResponse<string|ArrayBuffer|Blob|object>): Promise<void>
    {
        let responseString: string;

        if(isBlank(response.body))
        {
            responseString = '';
        }
        else if(isString(response.body))
        {
            responseString = response.body;
        }
        else if(response.body instanceof Blob)
        {
            responseString = await new Promise(resolve =>
            {
                const reader = new FileReader();

                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(response.body as Blob);
            });
        }
        else if(response.body instanceof ArrayBuffer)
        {
            let binary = '';
            const bytes = new Uint8Array(response.body as ArrayBuffer);
            const len = bytes.byteLength;

            for (let x = 0; x < len; x++) 
            {
                binary += String.fromCharCode(bytes[x]);
            }

            responseString = btoa(binary);
        }
        else
        {
            responseString = JSON.stringify(response.body, null, 4);
        }
        
        return await lastValueFrom(this
            ._logResponse(
            {
                url: request.url,
                response: responseString
            }))
            .catch(_ => console.warn('Failed to log mock data'));
    }

    //######################### private fields #########################
    
    /**
     * Gets information about running application
     * @returns Observable
     */
    @JsonContentType()
    @DisableMiddleware(ClientErrorHandlingMiddleware)
    @DisableMiddleware(MockLoggerMiddleware)
    @DisableInterceptor(AuthInterceptor)
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('mockLogger')
    private _logResponse(@Body _mock: {url: string, response: string}): Observable<any>
    {
        return NEVER;
    }
}