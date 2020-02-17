import {StaticProvider, ValueProvider} from "@angular/core";
import {SERVER_BASE_URL, SERVER_COOKIE_HEADER} from '@anglr/common';

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
            provide: SERVER_BASE_URL,
            useValue: additionalData.baseUrl
        },
        <ValueProvider>
        {
            provide: SERVER_COOKIE_HEADER,
            useValue: additionalData.requestCookies
        }
    ];
}