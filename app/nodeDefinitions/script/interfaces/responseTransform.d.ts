import {Observable} from "rxjs";

/**
 * Response transform script interface for transformation of response from http request
 */
export interface ResponseTransformScript
{
    /**
     * Method that transforms value into any requested value
     * @param value Value to be transformed
     */
    responseTransform(response: Observable<any>): Observable<any>;
}