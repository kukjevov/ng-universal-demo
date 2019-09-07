import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@ng/common/router';
import {Authorize, AuthGuard} from '@ng/authentication';
import * as moment from 'moment';

/**
 * Bootstrap samples component
 */
@Component(
{
    selector: "bootstrap-samples",
    templateUrl: "bootstrapSamples.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'bootstrap', canActivate: [AuthGuard]})
@Authorize("bootstrapSample-page")
export class BootstrapSamplesComponent
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