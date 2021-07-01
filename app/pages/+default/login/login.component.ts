import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ComponentRoute} from '@anglr/common/router';
import {AuthenticationService} from '@anglr/authentication';
import {slideInOutTrigger} from '@anglr/animations';
import {Logger, LOGGER} from '@anglr/common';
import {EMPTY} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Page containing login form
 */
@Component(
{
    selector: 'login-view',
    templateUrl: 'login.component.html',
    host:
    {
        '[class.justify-content-center]': 'true'
    },
    animations: [slideInOutTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'login', data: {animation: 'login'}})
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
                private _changeDetector: ChangeDetectorRef,
                @Inject(LOGGER) private _logger: Logger,
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
        //TODO - add resolver that checks logged user and redirects to requested page
        this._authService
            .login(this.form.value)
            .pipe(catchError(e =>
            {
                this._logger.error(`Failed to log in '${e}'`);
                this.authenticationError = true;
                this._changeDetector.detectChanges();
                
                return EMPTY;
            }))
            .subscribe(() =>
            {
                this.authenticationError = false;
                
                this._changeDetector.detectChanges();
                
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