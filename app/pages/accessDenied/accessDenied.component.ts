import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {StatusCodeService} from '@ng/common';

/**
 * Component used for displaying access denied page
 */
@Component(
{
    selector: 'access-denied-view',
    templateUrl: "accessDenied.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path:'accessDenied'})
export class AccessDeniedComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        statusCodeService.setStatusCode(403);
    }
}