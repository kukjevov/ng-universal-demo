import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ComponentRoute, ComponentRedirectRoute} from "@anglr/common/router";
import {Authorize, AuthGuard} from '@anglr/authentication';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize("home-page")
export class HomeComponent
{
    public control: FormControl;

    constructor()
    {
        this.control = new FormControl();

        this.control.valueChanges.subscribe(val => console.log('val', val));
    }
}
