import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ComponentRoute} from '@anglr/common/router';
import {AuthenticationService} from '@anglr/authentication';
import {LocalizePipe, Logger, LOGGER, WithPageContentCssClass} from '@anglr/common';
import {EMPTY} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AnimateRouteDirective} from '../../../directives';

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
    imports:
    [
        LocalizePipe,
        ReactiveFormsModule,
    ],
    hostDirectives:
    [
        AnimateRouteDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'login', data: {animation: 'login'}})
@WithPageContentCssClass()
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
    constructor(private _authService: AuthenticationService,
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
            rememberMe: null,
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
