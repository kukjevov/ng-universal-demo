import {Injectable} from '@angular/core';
import {HttpParams, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {RESTClient, GET, BaseUrl, DefaultHeaders, ResponseTransform, POST, FullHttpResponse, DisableInterceptor, Body} from '@anglr/rest';
import {UserIdentity, AccessToken, AuthInterceptor, SuppressAuthInterceptor} from '@anglr/authentication';
import {ServiceUnavailableInterceptor, HttpGatewayTimeoutInterceptor, NoConnectionInterceptor} from '@anglr/error-handling';
import {Dictionary} from '@jscrpt/common';
import {NEVER, Observable, Observer, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {config} from '../../../config';
import {UserInfo} from './account.interface';
import permissions from '../../../../config/permissions.json';

/**
 * Service used to access user account information
 */
@Injectable({providedIn: 'root'})
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class AccountService extends RESTClient
{
    //######################### private fields #########################

    /**
     * Computed permissions for roles
     */
    private _permissions: Dictionary<string[]>|undefined|null;

    //######################### private properties #########################

    /**
     * Gets computed permissions for roles
     */
    private get permissions(): Dictionary<string[]>
    {
        return this._permissions ?? (this._permissions = this._computePermissionsForRoles());
    }

    //######################### public methods - implementation of AuthenticationServiceOptions #########################

    /**
     * Method logs user into system
     * @param  {AccessToken} accessToken Access token used for authentication
     * @returns Observable
     */
    public login(accessToken: AccessToken): Observable<void>
    {
        const body = new HttpParams()
            .append('j_username', accessToken.userName)
            .append('j_password', accessToken.password)
            .append('remember-me', accessToken.rememberMe?.toString());

        return this._login(body);
    }

    /**
     * Methods logs out user out of system
     * @returns Observable
     */
    @POST('logout')
    public logout(): Observable<void>
    {
        return NEVER;
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
    @GET('myaccount')
    public getUserIdentity(): Observable<UserIdentity>
    {
        return NEVER;
    }

    //######################### private methods #########################

    /**
     * Sends login data to server
     */
    @DisableInterceptor(SuppressAuthInterceptor)
    @POST('authentication')
    private _login(@Body _body: HttpParams): Observable<void>
    {
        return NEVER;
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
                        userName: '',
                        permissions: [],
                        firstName: '',
                        surname: ''
                    });
                    
                    observer.complete();
                });
            }

            switch(error.status)
            {
                case 503:
                {
                    alert('Vzdialená služba je nedostupná. Skúste opätovne neskôr.');

                    break;
                }
                case 504:
                {
                    alert('Vypršal čas na spracovanie požiadavky cez http proxy. Skúste opätovne neskôr.');

                    break;
                }
                case 0:
                {
                    alert('Server je mimo prevádzky. Skúste opätovne neskôr.');

                    break;
                }
            }

            return throwError(error);
        }),
        map(data =>
        {
            if(data instanceof HttpResponse)
            {
                const body: UserInfo = data.body;
                const privileges = this._roles2privileges(body.roles);

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
        const perms: {[permission: string]: boolean} = {};

        (roles ?? []).forEach(role => (this.permissions[role] ?? []).forEach(permission => perms[permission] = true));

        return Object.keys(perms);
    }

    /**
     * Computes permissions for roles
     */
    private _computePermissionsForRoles(): Dictionary<string[]>
    {
        const computedPermissions: Dictionary<string[]> = {};

        Object.keys(permissions).forEach(permission =>
        {
            const roles = (permissions as Dictionary)[permission];

            if(Array.isArray(roles))
            {
                roles.forEach(role =>
                {
                    computedPermissions[role] ??= [];
                    computedPermissions[role].push(permission);
                });
            }
        });

        return computedPermissions;
    }
}