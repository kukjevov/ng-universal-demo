import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, ComponentRouteAuthorized} from '@anglr/authentication';
import {DebugDataCopyClickModule} from '@anglr/common/material';
import {NgScrollbarModule} from 'ngx-scrollbar';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    standalone: true,
    imports:
    [
        DebugDataCopyClickModule,
        NgScrollbarModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRouteAuthorized({path: 'home'})
@Authorize('home-page')
export class HomeComponent
{
}
