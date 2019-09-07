import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {StatusCodeService} from '@ng/common';

/**
 * Page displayed when url was not found
 */
@Component(
{
    selector: 'not-found-view',
    templateUrl: 'notFound.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: '**'})
export class NotFoundComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        statusCodeService.setStatusCode(404);
    }
}