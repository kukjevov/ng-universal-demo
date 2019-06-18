import {Component} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {StatusCodeService} from '@ng/common';
import {flyInOutTrigger} from '@ng/animations';
import {BaseAnimatedComponent} from "../../misc/baseAnimatedComponent";

/**
 * Component used for displaying access denied page
 */
@Component(
{
    selector: 'access-denied-view',
    templateUrl: "accessDenied.component.html",
    animations: [flyInOutTrigger]
})
@ComponentRoute({path:'accessDenied'})
export class AccessDeniedComponent extends BaseAnimatedComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        super();

        statusCodeService.setStatusCode(403);
    }
}