import {HttpRequestIgnoredInterceptorId} from '@anglr/common';
import {HttpEvent, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';
import {ClassProvider} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {RedirectLocationService} from './redirectLocation.service';

/**
 * Interceptor used for obtaining location for redirection for http responses 401, 403 status codes
 */
export class RedirectLocationInterceptor implements HttpInterceptor
{
    //######################### constructors #########################
    constructor(private _svc: RedirectLocationService)
    {
    }

    //######################### public methods - implementation of HttpInterceptor #########################

    /**
     * Intercepts http request
     * @param req - Request to be intercepted
     * @param next - Next middleware that can be called for next processing
     */
    public intercept(req: HttpRequestIgnoredInterceptorId<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        return next.handle(req)
            .pipe(tap(() => {},
                      (err: HttpErrorResponse) =>
                      {
                          //client error, not response from server, or is ignored
                          if (err.error instanceof Error)
                          {
                              return;
                          }

                          //if auth error
                          if(err.status == 403 || err.status == 401)
                          {
                              this._svc.location = err.headers.get("location");
                          }
                      }));
    }
}

/**
 * Provider for proper use of RedirectLocationInterceptor, use this provider to inject this interceptor
 */
export const REDIRECT_LOCATION_INTERCEPTOR_PROVIDER: ClassProvider =
{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: RedirectLocationInterceptor
};