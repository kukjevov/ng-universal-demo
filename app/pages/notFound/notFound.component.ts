import {Component, ChangeDetectionStrategy} from '@angular/core';
import {StatusCodeService} from '@anglr/common';

import {AnimateRouteDirective} from '../../directives';

/**
 * Page displayed when url was not found
 */
@Component(
{
    selector: 'not-found-view',
    templateUrl: 'notFound.component.html',
    hostDirectives:
    [
        AnimateRouteDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class NotFoundComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        statusCodeService.setStatusCode(404);
    }
}