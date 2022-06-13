import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '@anglr/authentication';
import {TitledDialogService} from '@anglr/common/material';

import {UserSettingsSAComponent} from '../../../../components';

/**
 * Component used for displaying application main menu
 */
@Component(
{
    selector: 'main-menu',
    templateUrl: 'mainMenu.component.html',
    // styleUrls: ['mainMenu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent
{
    //######################### constructor #########################
    constructor(private _authSvc: AuthenticationService<any>,
                private _router: Router,
                private _dialog: TitledDialogService)
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
        this._dialog.open(UserSettingsSAComponent,
        {
            title: 'user settings',
            maxHeight: '80vh'
        });
    }
}