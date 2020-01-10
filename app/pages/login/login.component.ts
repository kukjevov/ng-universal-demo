import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ComponentRoute} from '@anglr/common/router';
import {AuthenticationService, Authorize, AuthGuard} from '@anglr/authentication';
import {empty} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Page containing login form
 */
@Component(
{
    selector: 'login-view',
    templateUrl: 'login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'login', canActivate: [AuthGuard]})
@Authorize("login-page")
export class LoginComponent
{
    //######################### public properties #########################

    /**
     * Form group for login information
     */
    public form: FormGroup;

    /**
     * Indication that there is authentication error
     */
    public authenticationError: boolean = false;
    
    //######################### constructor #########################
    constructor(private _authService: AuthenticationService<any>,
                private _router: Router,
                private _activeRoute: ActivatedRoute,
                formBuilder: FormBuilder)
    {
        this.form = formBuilder.group(
        {
            userName: null,
            password: null,
            rememberMe: null
        });
    }
    
    //######################### public methods #########################
    
    /**
     * Logs in user
     */
    public login()
    {
        this._authService
            .login(this.form.value)
            .pipe(catchError(() =>
            {
                this.authenticationError = true;
                
                return empty();
            }))
            .subscribe(() =>
            {
                this.authenticationError = false;
                
                if(this._activeRoute.snapshot.queryParams.returnUrl)
                {
                    this._router.navigateByUrl(this._activeRoute.snapshot.queryParams.returnUrl);
                }
                else
                {
                    this._router.navigate(['/']);
                }
            });
    }
}