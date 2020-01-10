import {Injectable, Optional, Inject, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HttpClient, HttpParams, HttpErrorResponse, HttpResponse, HttpRequest, HttpEventType} from '@angular/common/http';
import {RESTClient, GET, BaseUrl, DefaultHeaders, ResponseTransform, RestTransferStateService, POST, FullHttpResponse, DisableInterceptor} from '@anglr/rest';
import {SERVER_BASE_URL, SERVER_COOKIE_HEADER, SERVER_AUTH_HEADER, IgnoredInterceptorsService, HttpRequestIgnoredInterceptorId} from "@anglr/common";
import {AuthenticationServiceOptions, UserIdentity, AccessToken, AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {Observable, Observer, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as global from 'config/global';

/**
 * Service used to access user account information
 */
@Injectable()
@BaseUrl(global.apiBaseUrl)
@DefaultHeaders(global.defaultApiHeaders)
export class AccountService extends RESTClient implements AuthenticationServiceOptions<any>
{
    //######################### constructor #########################
    public constructor(http: HttpClient,
                       private _injector: Injector,
                       private _location: Location,
                       @Optional() transferState?: RestTransferStateService,
                       @Optional() @Inject(SERVER_BASE_URL) baseUrl?: string,
                       @Optional() @Inject(SERVER_COOKIE_HEADER) serverCookieHeader?: string,
                       @Optional() @Inject(SERVER_AUTH_HEADER) serverAuthHeader?: string,
                       @Optional() ignoredInterceptorsService?: IgnoredInterceptorsService)
    {
        super(http, transferState, baseUrl, serverCookieHeader, serverAuthHeader, ignoredInterceptorsService, _injector);
    }

    //######################### public methods - implementation of AuthenticationServiceOptions #########################

    /**
     * Method logs user into system
     * @param  {AccessToken} accessToken Access token used for authentication
     * @returns Observable
     */
    public login(accessToken: AccessToken): Observable<any>
    {
        return Observable.create((observer: Observer<any>) =>
        {
            let req: HttpRequestIgnoredInterceptorId<any> = new HttpRequest<any>('POST',
                                                                                 `${global.apiBaseUrl}authentication`,
                                                                                 new HttpParams()
                                                                                    .append("j_username", accessToken.userName)
                                                                                    .append("j_password", accessToken.password)
                                                                                    .append("remember-me", accessToken.rememberMe.toString()));

            req.requestId = 'authenticate-call';

            this.ignoredInterceptorsService.addInterceptor(SuppressAuthInterceptor, req);

            this.http.request(req).subscribe(result =>
                                             {
                                                if(result.type == HttpEventType.Response)
                                                {
                                                    observer.next(result);
                                                    observer.complete();
                                                }
                                             },
                                             error => observer.error(error));
        });
    }

    /**
     * Gets indication whether current state of app is displaying login page
     * @returns boolean
     */
    public isAuthPage(): boolean
    {
        return this._location.path().indexOf('/login') == 0;
    }

    /**
     * Methods logs out user out of system
     * @returns Observable
     */
    @POST('logout')
    public logout(): Observable<any>
    {
        return null;
    }

    /**
     * Gets information about user
     * @returns Observable
     */
    @ResponseTransform()
    @FullHttpResponse()
    @DisableInterceptor(SuppressAuthInterceptor)
    @DisableInterceptor(AuthInterceptor)
    @GET("myaccount")
    public getUserIdentity(): Observable<UserIdentity<any>>
    {
        return null;
    }

    /**
     * Redirects current page to authentication page
     */
    public showAuthPage(): Promise<boolean>
    {
        return this._injector.get(Router).navigate(['/login'], {queryParams: {returnUrl: this._location.path()}});
    }

    /**
     * Redirects current page to access denied page
     */
    public showAccessDenied(): Promise<boolean>
    {
        return this._injector.get(Router).navigate(['/accessDenied']);
    }

    //######################### private methods #########################

    /**
     * Method transforms response of get method
     * @param  {Observable<IFinancialRecordResponse>} response Response to be transformed
     * @returns Observable Transformed response
     */
    //@ts-ignore
    private getUserIdentityResponseTransform(response: Observable<HttpResponse<any>>): Observable<any>
    {
        return response.pipe(catchError((error: HttpErrorResponse) =>
        {
            if(error.status == 401)
            {
                return Observable.create((observer: Observer<any>) =>
                {
                    observer.next(
                    {
                        isAuthenticated: false,
                        userName: "",
                        permissions: ["login-page"],
                        firstName: "",
                        surname: ""
                    });
                    
                    observer.complete();
                });
            }

            return throwError(error);
        }),
        map(data =>
        {
            if(data instanceof HttpResponse)
            {
                var tmp: any = data.body;

                return {
                    isAuthenticated: true,
                    userName: tmp.login,
                    firstName: '',      // FIXME tmp.firstName,
                    surname: tmp.login, // FIXME tmp.lastName,
                    permissions: tmp.privileges
                };
            }
            else
            {
                return data;
            }
        }));
    }
}