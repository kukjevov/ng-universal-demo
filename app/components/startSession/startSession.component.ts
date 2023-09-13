import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

/**
 * Component used for displaying goldman start session 
 */
@Component(
{
    selector: 'goldman-start-session',
    templateUrl: 'startSession.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoldmanStartSessionSAComponent
{
    //######################### protected properties - template bindings #########################

    //######################### constructor #########################
    constructor(private _dialog: MatDialogRef<boolean>,)
    {
    }

    //######################### protected methods - template bindings #########################

    /**
     * Starts session
     */
    protected async start(): Promise<void>
    {
        this._dialog.close(true);
    }
}