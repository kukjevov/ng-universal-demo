import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {Authorize, AuthGuard} from '@ng/authentication';

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
}