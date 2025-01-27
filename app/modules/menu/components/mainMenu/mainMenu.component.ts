import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService, AuthorizeDirective} from '@anglr/authentication';
import {TitledDialogService} from '@anglr/common/material';

import {UserSettingsComponent} from '../../../../components';
import {VersionUpdateService} from '../../../../services/versionUpdate';

/**
 * Component used for displaying application main menu
 */
@Component(
{
    selector: 'main-menu',
    templateUrl: 'mainMenu.component.html',
    imports:
    [
        RouterLink,
        RouterLinkActive,
        AuthorizeDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent
{
    //######################### constructor #########################
    constructor(private _authSvc: AuthenticationService,
                private _router: Router,
                private _dialog: TitledDialogService,
                protected versionUpdateSvc: VersionUpdateService,)
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Logs out user
     */
    public async logout()
    {
        this._authSvc
            .logout()
            .subscribe(() =>
            {
                this._router.navigate(['/login']);
            });
    }

    /**
     * Opens settings dialog
     */
    public openSettings()
    {
        this._dialog.open(UserSettingsComponent,
        {
            title: 'user settings',
            maxHeight: '80vh'
        });
    }
}
