import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AccessToken, AuthenticationServiceOptions, UserIdentity} from '@anglr/authentication';
import {isPresent} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {AccountService} from './account.service';

/**
 * Class represents authentication service options for account
 */
@Injectable()
export class AccountAuthOptions extends AuthenticationServiceOptions
{
    //######################### constructor #########################
    constructor(private _router: Router,
                private _accountSvc: AccountService,
                private _location: Location)
    {
        super();
    }

    //######################### public methods - implementation of AuthenticationServiceOptions #########################

    /**
     * @inheritdoc
     */
    public login(accessToken: AccessToken): Observable<void>
    {
        return this._accountSvc.login(accessToken);
    }
    
    /**
     * @inheritdoc
     */
    public isAuthPage(path?: string): boolean
    {
        if(isPresent(path))
        {
            return path.indexOf('/login') == 0;
        }

        return this._location.path().indexOf('/login') == 0;
    }
    
    /**
     * @inheritdoc
     */
    public logout(): Observable<void>
    {
        return this._accountSvc.logout();
    }
    
    /**
     * @inheritdoc
     */
    public getUserIdentity(): Observable<UserIdentity>
    {
        return this._accountSvc.getUserIdentity();
    }
    
    /**
     * @inheritdoc
     */
    public showAuthPage(): Promise<boolean>
    {
        return this._router.navigate(['/login'], {queryParams: {returnUrl: this._location.path()}});
    }
    
    /**
     * @inheritdoc
     */
    public showAccessDenied(): Promise<boolean>
    {
        return this._router.navigate(['/accessDenied']);
    }
}