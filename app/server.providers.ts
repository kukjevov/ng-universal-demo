import {StaticProvider, ValueProvider} from '@angular/core';
import {HTTP_REQUEST_BASE_URL, HTTP_REQUEST_COOKIE_HEADER} from '@anglr/common';

/**
 * Additional data passed for with request to render server
 */
export interface AdditionalData
{
    /**
     * Base url of running server
     */
    baseUrl: string;

    /**
     * Request cookies from header
     */
    requestCookies: string;
}

/**
 * Gets additional providers
 * @param additionalData Additional data
 */
export function getAdditionalProviders(additionalData: AdditionalData): StaticProvider[]
{
    return [
        <ValueProvider>
        {
            provide: HTTP_REQUEST_BASE_URL,
            useValue: additionalData.baseUrl
        },
        <ValueProvider>
        {
            provide: HTTP_REQUEST_COOKIE_HEADER,
            useValue: additionalData.requestCookies
        }
    ];
}