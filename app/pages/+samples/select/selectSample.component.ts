import {Component, ChangeDetectionStrategy} from '@angular/core';
import {isString} from '@asseco/common';
import {ComponentRoute} from '@ng/common';
import {AuthGuard, Authorize} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';
import {KodPopisValue} from '../../../misc/types';

import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";
import {DataService} from '../../../services/api/data/data.service';
import {NgSelectOptions, GetOptionsCallback, NgSelectOption, BasicLiveSearchComponent, DynamicValueHandlerComponent, DynamicValueHandlerOptions, DynamicOptionsGatherer} from '../../../ng-select';

/**
 * Select samples component
 */
@Component(
{
    selector: "select-sample",
    templateUrl: "selectSample.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DataService],
    animations: [flyInOutTrigger]
})
@ComponentRoute({path: 'select', canActivate: [AuthGuard]})
@Authorize("selectSample-page")
export class SelectSampleComponent extends BaseAnimatedComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Select options that are used for select initialization
     */
    public selectOptions: NgSelectOptions<KodPopisValue>;

    /**
     * Select options that are used for select initialization, live search
     */
    public liveSearchSelectOptions: NgSelectOptions<KodPopisValue>;

    /**
     * Indication whether is NgSelect readonly
     */
    public readonly: boolean = false;

    //######################### constructor #########################
    constructor(private _dataSvc: DataService)
    {
        super();

        this.selectOptions =
        {
            plugins:
            {
                liveSearch:
                {
                    type: BasicLiveSearchComponent
                },
                valueHandler:
                {
                    type: DynamicValueHandlerComponent,
                    options: <DynamicValueHandlerOptions<KodPopisValue>>
                    {
                        dynamicOptionsCallback: this._getData
                    }
                }
            },
            optionsGatherer: new DynamicOptionsGatherer({dynamicOptionsCallback: this._getData})
        };

        this.liveSearchSelectOptions =
        {
            plugins:
            {
                liveSearch:
                {
                    type: BasicLiveSearchComponent
                }
            }
        };
    }

    //######################### private methods #########################
    
    /**
     * Used for obtaining dynamic options
     */
    private _getData: GetOptionsCallback<KodPopisValue> = (async value =>
    {
        if(!isString(value))
        {
            value = value.kod;
        }

        let result = await this._dataSvc
            .getCis(value, 1)
            .toPromise();

        if(!result || !result.content || !result.content.length)
        {
            return [];
        }

        return result.content.map(itm =>
        {
            return <NgSelectOption<KodPopisValue>>
            {
                value: itm.kod,
                text: itm.popis
            };
        });
    });
}