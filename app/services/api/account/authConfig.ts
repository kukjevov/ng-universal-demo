import {Injectable, Injector} from "@angular/core";
import {AuthenticationService, AUTHENTICATION_SERVICE_OPTIONS, AuthenticationServiceOptions, AuthInterceptorConfig, UserIdentity} from "@anglr/authentication";

/**
 * Auth Interceptor Config implementation
 */
@Injectable()
export class AuthConfig extends AuthInterceptorConfig
{
    //######################### private fields #########################

    /**
     * Auth service
     */
    private _authSvc: AuthenticationService<any>;

    /**
     * Account service
     */
    private _accountSvc: AuthenticationServiceOptions<any>;

    //######################### private properties #########################

    /**
     * Gets auth service
     */
    private get authSvc(): AuthenticationService<any>
    {
        return this._authSvc || (this._authSvc = this._injector.get(AuthenticationService));
    }

    /**
     * Gets account service
     */
    private get accountSvc(): AuthenticationServiceOptions<any>
    {
        return this._accountSvc || (this._accountSvc = this._injector.get(AUTHENTICATION_SERVICE_OPTIONS));
    }

    //######################### constructor #########################
    constructor(private _injector: Injector)
    {
        super();
    }

    //######################### public methods - overriden AuthInterceptorConfig #########################

    /**
     * Gets indication whether is user authenticated or not
     * @returns boolean
     */
    public isAuthenticated(): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            this.authSvc.getUserIdentity(true)
                .catch(error => reject(error))
                .then((identity: UserIdentity<any>) =>
                {
                    resolve(identity.isAuthenticated);
                });
        });
    }

    /**
     * Gets indication whether request was done from authentication page
     * @returns boolean
     */
    public isAuthPage(): boolean
    {
        return this.accountSvc.isAuthPage();
    }

    /**
     * Redirects current page to authentication page
     */
    public showAuthPage(): Promise<boolean>
    {
        return this.accountSvc.showAuthPage();
    }

    /**
     * Redirects current page to access denied page
     */
    public showAccessDenied(): Promise<boolean>
    {
        return this.accountSvc.showAccessDenied();
    }
}