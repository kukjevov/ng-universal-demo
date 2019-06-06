import {Component} from '@angular/core';
import {ComponentRoute} from '@ng/common';
import {Authorize, AuthGuard} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';

import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";

@Component(
{
    selector: "authorization-sample",
    templateUrl: 'authorizationSample.component.html',
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: 'authorization', canActivate: [AuthGuard]})
@Authorize("authorizationSample-page")
export class AuthorizationSampleComponent extends BaseAnimatedComponent
{
}