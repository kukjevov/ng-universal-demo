import {Component} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {StatusCodeService} from '@ng/common';
import {flyInOutTrigger} from '@ng/animations';
import {BaseAnimatedComponent} from "../../misc/baseAnimatedComponent";

/**
 * Page displayed when url was not found
 */
@Component(
{
    selector: 'not-found-view',
    templateUrl: 'notFound.component.html',
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: '**'})
export class NotFoundComponent extends BaseAnimatedComponent
{
    //######################### constructor #########################
    constructor(statusCodeService: StatusCodeService)
    {
        super();

        statusCodeService.setStatusCode(404);
    }
}