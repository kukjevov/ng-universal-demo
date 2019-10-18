import {Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef, ViewChild} from '@angular/core';
import {trigger, transition, style, animate, query, animateChild} from '@angular/animations';
import {ComponentRoute} from '@ng/common/router';
import {GridOptions, AsyncDataLoaderOptions, SimpleOrdering, BasicPagingOptions, DataResponse, GridComponent, DATA_LOADER, DataLoader} from '@ng/grid';
import {GridDataService} from '../../services/api/gridData/gridData.service';
import {VirtualScrollTableContentRendererComponent, CdkVirtualScrollPagingComponent} from '@ng/grid/material';

/**
 * Home component
 */
@Component(
{
    selector: 'garden-view',
    templateUrl: 'garden.component.html',
    providers: [GridDataService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations:
    [
        trigger('slowFade',
        [
            transition('void => *',
            [
                style(
                {
                    opacity: 0
                }),
                animate(1000, style(
                {
                    opacity: 1
                }))
            ]),
            transition('* => void',
            [
                animate(1000, style(
                {
                    opacity: 0
                }))
            ])
        ]),
        trigger('componentContent',
        [
            transition(':enter, :leave',
            [
                query('@*', animateChild())
            ])
        ])
    ]
})
@ComponentRoute({path: 'garden'})
export class GardenComponent
{
    //######################### public properties #########################

    /**
     * Grid options that are used for grid initialization
     */
    public gridOptions: GridOptions;

    /**
     * Grid component instance
     */
    @ViewChild('gridSample', {static: false})
    public _sampleGrid: GridComponent;

    @HostBinding('@componentContent')
    public animation: boolean = true;

    // @ViewChild(CdkVirtualScrollViewport)
    // public scroll: CdkVirtualScrollViewport; 

    public condition: boolean = true;

    // public get fromStart(): number
    // {
    //     // if(!this.scroll)
    //     // {
    //     //     return 0;
    //     // }

    //     // return -this.scroll.getOffsetToRenderedContentStart();
    // };

    constructor(private _changeDetector: ChangeDetectorRef,
                private _dataSvc: GridDataService)
    {
        this.gridOptions =
        {
            plugins:
            {
                contentRenderer:
                {
                    type: VirtualScrollTableContentRendererComponent
                },
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: (page: number, itemsPerPage: number, ordering: SimpleOrdering) =>
                        {
                            let dataLoader = this._sampleGrid.getPlugin(DATA_LOADER) as DataLoader<DataResponse<any>>;
                            return this._getDataLoadMore(page, itemsPerPage, ordering, dataLoader);
                        }
                    }
                },
                paging:
                {
                    type: CdkVirtualScrollPagingComponent,
                    options: <BasicPagingOptions>
                    {
                        initialItemsPerPage: 30
                    }
                }
                // metadataSelector:
                // {
                //     type: AdvancedMetadataSelectorComponent,
                //     options: <AdvancedMetadataSelectorOptions>
                //     {
                //         cookieName: 'sample-grid',
                //         texts:
                //         {
                //             btnOpenSelection: 'VÝBER STĹPCOV',
                //             titleAvailableColumns: 'Dostupné stĺpce'
                //         }
                //     }
                // }
            }
        };
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._changeDetector.detectChanges();
        this._changeDetector.detectChanges();

        // console.log('data length', this.scroll.getDataLength());
        // console.log('data range', this.scroll.getRenderedRange());
        // console.log('measure content', this.scroll.measureRenderedContentSize());
        // this.scroll.renderedRangeStream.subscribe(range =>
        // {
        //     console.log('changes', this.fromStart);

        //     console.log('range change XXXXX', range)
        // });
    }

    public log()
    {
        console.log('log scroll index change');
        // console.log('data length', this.scroll.getDataLength());
        // console.log('data range', this.scroll.getRenderedRange());
        // console.log('viewport size', this.scroll.getViewportSize());
        // console.log('offset from start', this.scroll.getOffsetToRenderedContentStart());
        // console.log('measure start', this.scroll.measureScrollOffset());
        // console.log('measure content', this.scroll.measureRenderedContentSize());
    }

    //######################### private methods #########################

    /**
     * Callback used for obtaining data
     * @param  {number} page Index of requested page
     * @param  {number} itemsPerPage Number of items per page
     * @param  {TOrdering} ordering Order by column name
     */
    private async _getDataLoadMore(page: number, itemsPerPage: number, ordering: SimpleOrdering, dataLoader: DataLoader<DataResponse<any>>): Promise<DataResponse<any>>
    {
        let result = await this._dataSvc
            .getGridData(
            {
                page: (page - 1),
                size: itemsPerPage
            }).toPromise();

        let data = [...dataLoader.result.data, ...result.content];

        return {
            data: data,
            totalCount: result.last ? data.length : (data.length + 1)
        };
    }

    public add()
    {
        this.data = [...this.data, ...this.data];
    }

    public data: string[] =
    [
        "test",
        "test1",
        "test2",
        "test3",
        "test4",
        "test5",
        "test6",
        "test7",
        "test8",
        "test9",
        "test10",
        "test11",
        "test12",
        "test13",
        "test14",
        "test15",
        "test16",
        "test17",
        "test18",
        "test19",
        "test20",
        "test21",
        "test22",
        "test23",
        "test24",
        "test25",
        "test26",
        "test27",
        "test28",
        "test29",
        "test30",
        "test31",
        "test32",
        "test33",
        "test34",
        "test35",
        "test36",
        "test37",
        "test38",
        "test39",
        "test40",
        "test41",
        "test42",
        "test43",
        "test44",
        "test45",
        "test46",
        "test47",
        "test48",
        "test49",
        "test50",
        "test51",
        "test52",
        "test53",
        "test54",
        "test55",
        "test56",
        "test57",
        "test58",
        "test59",
        "test60",
        "test61",
        "test62",
        "test63",
        "test64",
        "test65",
        "test66",
        "test67",
        "test68",
        "test69"
    ];
}
