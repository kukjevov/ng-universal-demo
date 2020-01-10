import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';
import {StatusCodeService} from '@anglr/common';

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