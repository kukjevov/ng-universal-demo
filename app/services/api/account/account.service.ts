import {Injectable, Optional, Inject, Injector, Type} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HttpClient, HttpParams, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HTTP_REQUEST_BASE_URL} from '@anglr/common';
import {RESTClient, GET, BaseUrl, DefaultHeaders, ResponseTransform, POST, FullHttpResponse, DisableInterceptor, REST_MIDDLEWARES_ORDER, REST_METHOD_MIDDLEWARES, RestMiddleware, Body} from '@anglr/rest';
import {AuthenticationServiceOptions, UserIdentity, AccessToken, AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {ServiceUnavailableInterceptor, HttpGatewayTimeoutInterceptor, NoConnectionInterceptor} from '@anglr/error-handling';
import {isBlank} from '@jscrpt/common';
import {Observable, Observer, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {config} from '../../../config';
import {UserInfo} from './account.interface';
import permissions from '../../../../config/permissions.json';

/**
 * Service used to access user account information
 */
@Injectable()
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class AccountService extends RESTClient implements AuthenticationServiceOptions<any>
{
    //######################### private fields #########################

    /**
     * Computed permissions for roles
     */
    private _permissions: {[role: string]: string[]} = {};

    //######################### constructor #########################
    constructor(http: HttpClient,
                injector: Injector,
                private _location: Location,
                @Optional() @Inject(HTTP_REQUEST_BASE_URL) baseUrl?: string,
                @Inject(REST_MIDDLEWARES_ORDER) middlewaresOrder?: Type<RestMiddleware>[],
                @Inject(REST_METHOD_MIDDLEWARES) methodMiddlewares?: Type<RestMiddleware>[])
    {
        super(http, baseUrl, injector, middlewaresOrder, methodMiddlewares);

        this._computePermissionsForRoles();
    }

    //######################### public methods - implementation of AuthenticationServiceOptions #########################

    /**
     * Method logs user into system
     * @param  {AccessToken} accessToken Access token used for authentication
     * @returns Observable
     */
    public login(accessToken: AccessToken): Observable<any>
    {
        let body = new HttpParams()
            .append("j_username", accessToken.userName)
            .append("j_password", accessToken.password)
            .append("remember-me", accessToken.rememberMe?.toString());

        return this._login(body);
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
    @DisableInterceptor(ServiceUnavailableInterceptor)
    @DisableInterceptor(HttpGatewayTimeoutInterceptor)
    @DisableInterceptor(NoConnectionInterceptor)
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
        return this.injector.get(Router).navigate(['/login'], {queryParams: {returnUrl: this._location.path()}});
    }

    /**
     * Redirects current page to access denied page
     */
    public showAccessDenied(): Promise<boolean>
    {
        return this.injector.get(Router).navigate(['/accessDenied']);
    }

    //######################### private methods #########################

    /**
     * Sends login data to server
     */
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('authentication')
    private _login(@Body _body: HttpParams): Observable<any>
    {
        return null;
    }

    /**
     * Method transforms response of get method
     * @param response Response to be transformed
     * @returns Observable Transformed response
     */
    //@ts-ignore
    private getUserIdentityResponseTransform(response: Observable<HttpResponse<any>>): Observable<any>
    {
        return response.pipe(catchError((error: HttpErrorResponse) =>
        {
            if(error.status == 401)
            {
                return new Observable((observer: Observer<any>) =>
                {
                    observer.next(
                    {
                        isAuthenticated: false,
                        userName: "",
                        permissions: [],
                        firstName: "",
                        surname: ""
                    });
                    
                    observer.complete();
                });
            }

            switch(error.status)
            {
                case 503:
                {
                    alert("Vzdialená služba je nedostupná. Skúste opätovne neskôr.");

                    break;
                }
                case 504:
                {
                    alert("Vypršal čas na spracovanie požiadavky cez http proxy. Skúste opätovne neskôr.");

                    break;
                }
                case 0:
                {
                    alert("Server je mimo prevádzky. Skúste opätovne neskôr.");

                    break;
                }
            }

            return throwError(error);
        }),
        map(data =>
        {
            if(data instanceof HttpResponse)
            {
                let body: UserInfo = data.body;
                let privileges = this._roles2privileges(body.roles);

                return {
                    isAuthenticated: true,
                    userName: body.login,
                    firstName: '',
                    surname: body.login,
                    permissions: privileges.concat(['authenticated'])
                };
            }
            else
            {
                return data;
            }
        }));
    }

    /**
     * Gets array of permissions for provided roles
     * @param roles Array of roles to be transformed to permissions
     */
    private _roles2privileges(roles: string[]): string[]
    {
        let perms: {[permission: string]: boolean} = {};

        (roles ?? []).forEach(role => (this._permissions[role] ?? []).forEach(permission => perms[permission] = true));

        return Object.keys(perms);
    }

    /**
     * Computes permissions for roles
     */
    private _computePermissionsForRoles()
    {
        Object.keys(permissions).forEach(permission =>
        {
            let roles = permissions[permission];

            if(Array.isArray(roles))
            {
                roles.forEach(role =>
                {
                    if(isBlank(this._permissions[role]))
                    {
                        this._permissions[role] = [];
                    }

                    this._permissions[role].push(permission);
                });
            }
        });
    }
}