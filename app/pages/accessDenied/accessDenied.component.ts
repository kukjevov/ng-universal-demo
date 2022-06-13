import {Component, ChangeDetectionStrategy} from '@angular/core';
import {StatusCodeService} from '@anglr/common';

/**
 * Component used for displaying access denied page
 */
@Component(
{
    selector: 'access-denied-view',
    templateUrl: 'accessDenied.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDeniedComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        statusCodeService.setStatusCode(403);
    }
}