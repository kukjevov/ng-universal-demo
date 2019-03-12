import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormControl} from '@angular/forms';
import {isString} from '@asseco/common';
import {ComponentRoute} from '@ng/common';
import {AuthGuard, Authorize} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';

import {KodPopisValue} from '../../../misc/types';
import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";
import {DataService} from '../../../services/api/data/data.service';
import {NgSelectOptions, GetOptionsCallback, NgSelectOption, BasicLiveSearchComponent, DynamicValueHandlerComponent, DynamicValueHandlerOptions, DynamicOptionsGatherer} from '@ng/select';
import {CustomReadonlyStateComponent} from '../grid/customReadonlyState.component';

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
     * Select options that are used for select initialization, dynamic
     */
    public dynamicSelectOptions: NgSelectOptions<KodPopisValue>;

    /**
     * Select options that are used for select initialization, custom readonly
     */
    public readonlySelectOptions: NgSelectOptions<KodPopisValue>;

    /**
     * Select options that are used for select initialization, live search
     */
    public liveSearchSelectOptions: NgSelectOptions<KodPopisValue>;

    /**
     * Form control sample
     */
    public select: FormControl;

    /**
     * Form control sample, lazy
     */
    public selectLazy: FormControl;

    /**
     * Form control sample, readonly
     */
    public selectReadonly: FormControl;

    /**
     * Form control sample, custom readonly
     */
    public selectCustomReadonly: FormControl;

    /**
     * Form control sample, multiple
     */
    public selectMultiple: FormControl;

    /**
     * Form control sample, dynamic readonly
     */
    public selectDynamicReadonly: FormControl;

    /**
     * Form control sample, live search
     */
    public selectLiveSearch: FormControl;

    /**
     * Form control sample, custom templates
     */
    public selectCustomTemplates: FormControl;

    /**
     * Form control sample, dynamic
     */
    public selectDynamic: FormControl;

    /**
     * Indication whether is NgSelect readonly
     */
    public readonly: boolean = false;

    /**
     * Array of lazy options
     */
    public lazyOptions: KodPopisValue[] = [];

    //######################### constructor #########################
    constructor(private _dataSvc: DataService,
                private _changeDetector: ChangeDetectorRef)
    {
        super();

        this.select = new FormControl(null);
        this.selectLazy = new FormControl(null);
        this.selectReadonly = new FormControl(null);
        this.selectCustomReadonly = new FormControl(null);
        this.selectMultiple = new FormControl(null);
        this.selectDynamicReadonly = new FormControl(null);
        this.selectLiveSearch = new FormControl(null);
        this.selectCustomTemplates = new FormControl(null);
        this.selectDynamic = new FormControl(null);

        this.dynamicSelectOptions =
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

        this.readonlySelectOptions =
        {
            plugins:
            {
                readonlyState:
                {
                    type: CustomReadonlyStateComponent
                }
            }
        };

        setTimeout(() =>
        {
            this.lazyOptions = 
            [
                {
                    kod: 'first-x',
                    popis: 'First value text'
                },
                {
                    kod: 'second-x',
                    popis: 'Second value text'
                },
                {
                    kod: 'third-x',
                    popis: 'Third value text'
                },
                {
                    kod: 'fourth-x',
                    popis: 'Fourth value text'
                },
                {
                    kod: 'fifth-x',
                    popis: 'Fifth value text'
                }
            ];

            this._changeDetector.detectChanges();
        }, 2500);
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