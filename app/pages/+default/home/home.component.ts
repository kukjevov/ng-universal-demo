import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {DebugDataCopyClickModule} from '@anglr/common/material';

import {CustomSAComponent} from '../../../components';

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
        CustomSAComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
}
