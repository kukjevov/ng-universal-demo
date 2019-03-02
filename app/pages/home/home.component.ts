import {Component, OnInit, ViewChild} from '@angular/core';
import {trigger, animate, style, query, transition, group} from '@angular/animations';
import {FormBuilder, FormControl} from '@angular/forms';
import {isString} from '@asseco/common';
import {ComponentRoute} from "@ng/common";
import {flyInOutTrigger, slideInOutTriggerFactory} from '@ng/animations';
import {Authorize, AuthGuard} from '@ng/authentication';
import {FancyTreeNodeData, FancyTreeComponent} from '@ng/treeview';
import {map} from 'rxjs/operators';

import {DataService} from "../../services/api/data/data.service";
import {BaseAnimatedComponent} from "../../misc/baseAnimatedComponent";
import {NgSelectOptions, BasicLiveSearchComponent, DynamicValueHandlerComponent, DynamicOptionsGatherer, GetOptionsCallback, NgSelectOption, DynamicValueHandlerOptions} from '../../ng-select';
import {KodPopisValue} from '../../misc/types';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    providers: [DataService],
    animations:
    [
        slideInOutTriggerFactory({inParams: {heightDuration: '150ms', opacityDuration: '350ms'}, outParams: {heightDuration: '150ms 150ms', opacityDuration: '250ms'}}),
        flyInOutTrigger,
        trigger("test",
        [
            transition("* => *",
            [
                group(
                [
                    query("*:enter",
                    [
                        style({opacity: 0, position: 'absolute', transform: 'translateX(30%)'}),
                        animate(400, style({opacity: 1, transform: 'translateX(0)'}))
                    ], {optional: true}),
                    query("*:leave",
                    [
                        style({opacity: 1, position: 'absolute', transform: 'translateX(0)'}),
                        animate(400, style({opacity: 0, transform: 'translateX(-30%)'}))
                    ], {optional: true})
                ]),
            ])
        ])
    ]
})
@ComponentRoute({path: '', canActivate: [AuthGuard], data: {animation: 'home-view'}})
@Authorize("home-page")
export class HomeComponent extends BaseAnimatedComponent implements OnInit
{
    //######################### public properties #########################
    public subs: string;
    public show: boolean = false;
    public counter = 0;

    public selectOptions: NgSelectOptions<any>;

    public treeOptions: Fancytree.FancytreeOptions =
    {
        icon: (val, val2: Fancytree.EventData) =>
        {
            return !val2.node.isFolder() ? 'fa fa-file text-info' : 'fa fa-folder text-warning';
        },
        debugLevel: 0
    };

    public treeData: FancyTreeNodeData[] =
    [
        {
            content: 'uzol 1'
        },
        {
            content: 'uzol 2',
            folder: true,
            extraClasses: 'italic',
            key: 'zzz',
            expanded: true,
            children:
            [
                {
                    content: 'uzol 2.1'
                },
                {
                    content: 'uzol 2.2',
                    children:
                    [
                        {
                            content: 'uzol 2.2.1',
                            extraClasses: 'bold'
                        }
                    ]
                }
            ]
        }
    ]

    public trigger = "in";

    public ngSelect: FormControl;

    // public optionsGetter: GetOptionsCallback<string> = (query: string, options: Array<OptionComponent<string>>) =>
    // {
    //     return Promise.resolve(options.filter(itm => itm.text.indexOf(query) >= 0));
    // }

    @ViewChild('treeview')
    public tree: FancyTreeComponent;

    //######################### constructor #########################
    constructor(private dataSvc: DataService,
                formBuilder: FormBuilder)
    {
        super();

        this.ngSelect = formBuilder.control('third');

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
            optionsGatherer: new DynamicOptionsGatherer({dynamicOptionsCallback: this._getData}),
        };
    }

    //######################### public methods #########################
    public ngOnInit()
    {
        this.dataSvc.getData().pipe(map(data =>
        {
            return `${data.greeting} ${data.name}`;
        })).subscribe(data =>
        {
            this.subs = data;
        });
    }

    public longCall()
    {
        this.dataSvc.longCall().subscribe(() => console.log('done'));
    }

    public continue()
    {
        this.dataSvc.continue().subscribe(() => console.log('done'));
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewChecked()
    {
        this.tree.invalidateVisuals();
    }

    public inc()
    {
        this.trigger = this.trigger == 'in' ? 'out' : 'in';
        this.counter++;
    }

    public toggle()
    {
        this.show = !this.show;
    }

    private _getData: GetOptionsCallback<KodPopisValue> = (async value =>
    {
        if(!isString(value))
        {
            value = value.kod;
        }

        let result = await this.dataSvc
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
