import {Component} from '@angular/core';
import {ComponentRoute} from '@ng/common';
import {Authorize, AuthGuard} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';

import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";

/**
 * Bootstrap samples component
 */
@Component(
{
    selector: "bootstrap-samples",
    templateUrl: "bootstrapSamples.component.html",
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: 'bootstrap', canActivate: [AuthGuard]})
@Authorize("bootstrapSample-page")
export class BootstrapSamplesComponent extends BaseAnimatedComponent
{
    //######################### public properties #########################
    public date: moment.Moment = null;
    public select: string;
    public typeahead: any;
    public typeaheadTags: any[] = [];
    public selectValues = [{key: 1, value: "prva"}, {key: 2, value: "druha"}, {key: 3, value: "tretia"}];

    //######################### public methods #########################

    public confirm(data)
    {
        alert(`ok confirmed ${data}`);
    }

    public cancel(data)
    {
        alert(`no canceled ${data}`);
    }
}