import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ComponentRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';

import {SampleDialogComponent} from '../dialog/sampleDialog.component';

@Component(
{
    selector: "authorization-sample",
    templateUrl: 'authorizationSample.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'authorization', canActivate: [AuthGuard]})
@Authorize("authorizationSample-page")
export class AuthorizationSampleComponent
{
    //######################### constructor #########################
    constructor(private _dialog: MatDialog)
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Shows sample dialog
     */
    public showDialog()
    {
        this._dialog.open(SampleDialogComponent,
        {
            width: '20vw'
        });
    }
}