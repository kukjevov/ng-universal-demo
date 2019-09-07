import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {trigger, animate, style, query, transition, group} from '@angular/animations';
import {ComponentRoute} from "@ng/common/router";
import {slideInOutTriggerFactory} from '@ng/animations';
import {Authorize, AuthGuard} from '@ng/authentication';
import {map} from 'rxjs/operators';

import {DataService} from "../../services/api/data/data.service";
import {GridOptions, TableContentRendererOptions, AsyncDataLoaderOptions, SimpleOrdering, BasicPagingOptions, QueryPagingInitializerComponent, DataResponse} from '@ng/grid';
import {GridDataService} from '../../services/api/gridData/gridData.service';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    providers: [DataService, GridDataService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations:
    [
        slideInOutTriggerFactory({inParams: {heightDuration: '150ms', opacityDuration: '350ms'}, outParams: {heightDuration: '150ms 150ms', opacityDuration: '250ms'}}),
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
export class HomeComponent implements OnInit
{
    //######################### public properties #########################
    public subs: string;
    public show: boolean = false;
    public counter = 0;

    /**
     * Grid options that are used for grid initialization
     */
    public gridOptions: GridOptions;


    public trigger = "in";

    //######################### constructor #########################
    constructor(private dataSvc: DataService,
                private _grdDataSvc: GridDataService)
    {
        this.gridOptions =
        {
            plugins:
            {
                contentRenderer:
                {
                    options: <TableContentRendererOptions>
                    {
                    }
                },
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: this._getData.bind(this)
                    }
                },
                paging:
                {
                    options: <BasicPagingOptions>
                    {
                        itemsPerPageValues: [10, 20],
                        initialItemsPerPage: 10,
                        initialPage: 1
                    }
                },
                pagingInitializer:
                {
                    type: QueryPagingInitializerComponent
                }
            }
        };
    }

    //######################### public methods #########################
    public async ngOnInit()
    {
        this.subs = await this.dataSvc.getData().pipe(map(data =>
        {
            return `${data.greeting} ${data.name}`;
        })).toPromise();
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

    /**
     * Callback used for obtaining data
     * @param  {number} page Index of requested page
     * @param  {number} itemsPerPage Number of items per page
     * @param  {TOrdering} ordering Order by column name
     */
    private async _getData(page: number, itemsPerPage: number, ordering: SimpleOrdering): Promise<DataResponse<any>>
    {
        let result = await this._grdDataSvc
            .getGridData(
            {
                page: (page - 1),
                size: itemsPerPage
            }).toPromise();

        return {
            data: result.content,
            totalCount: result.totalElements
        };
    }
}
