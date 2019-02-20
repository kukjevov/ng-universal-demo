import {Component, ViewChild} from '@angular/core';
import {ComponentRedirectRoute, ComponentRoute} from '@ng/common';
import {GridOptions, GridComponent, SimpleOrdering, DataResponse, AsyncDataLoaderOptions, BasicPagingOptions, AdvancedMetadataSelectorComponent, AdvancedMetadataSelectorOptions, QueryPagingInitializerComponent, TableContentRendererOptions, DATA_LOADER, DataLoader, PreviousNextPagingComponent, PreviousNextPagingOptions, ContentVirtualScrollPagingComponent, ContentVirtualScrollPagingOptions, LoadMorePagingComponent, LoadMorePagingOptions, PageVirtualScrollPagingComponent, PageVirtualScrollPagingOptions} from '@ng/grid';
import {setPage, reinitializeOptions} from '@ng/grid/extensions';
import {Authorize, AuthGuard} from '@ng/authentication';
import {flyInOutTrigger} from '@ng/animations';

import {GridDataService} from "../../../services/api/gridData/gridData.service";
import {BaseAnimatedComponent} from "../../../misc/baseAnimatedComponent";

/**
 * Grid samples component
 */
@Component(
{
    selector: "grid-sample",
    templateUrl: "gridSample.component.html",
    providers:
    [
        GridDataService,
    ],
    animations: [flyInOutTrigger]
})
@ComponentRedirectRoute('')
@ComponentRoute({path: 'grid', canActivate: [AuthGuard]})
@Authorize("gridSample-page")
export class GridSampleComponent extends BaseAnimatedComponent
{
    //######################### public properties #########################

    /**
     * Grid options that are used for grid initialization
     */
    public gridOptions: GridOptions;

    /**
     * Grid options that are used for grid initialization
     */
    public gridLoadMoreOptions: GridOptions;
    
    // /**
    //  * Grid options that are used for grid initialization
    //  */
    // public gridGroupedOptions: GridOptions;

    /**
     * Grid options that are used for grid initialization
     */
    public gridContentScrollOptions: GridOptions;

    /**
     * Grid options that are used for grid initialization
     */
    public gridPageScrollOptions: GridOptions;

    /**
     * Grid options that are used for grid initialization
     */
    public gridPreviousNextOptions: GridOptions;

    /**
     * Grid component instance
     */
    @ViewChild('gridSample')
    public _sampleGrid: GridComponent;

    /**
     * Grid component instance
     */
    @ViewChild('gridLoadMore')
    public _gridLoadMore: GridComponent;


    /**
     * Grid component instance
     */
    @ViewChild('gridContentScroll')
    public _gridContentScroll: GridComponent;


    /**
     * Grid component instance
     */
    @ViewChild('gridPageScroll')
    public _gridPageScroll: GridComponent;

    //######################### constructor #########################
    constructor(private _dataSvc: GridDataService)
    {
        super();

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

        // this.gridGroupedOptions =
        // {
        //     plugins:
        //     {
        //         contentRenderer:
        //         {
        //             options: <TableContentRendererOptions>
        //             {
        //                 plugins:
        //                 {
        //                     headerRenderer:
        //                     {
        //                         type: GroupedTableHeaderContentRendererComponent
        //                     }
        //                 }
        //             }
        //         },
        //         dataLoader:
        //         {
        //             options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
        //             {
        //                 dataCallback: this._getData.bind(this)
        //             }
        //         },
        //         paging:
        //         {
        //             options: <BasicPagingOptions>
        //             {
        //                 itemsPerPageValues: [10, 20],
        //                 initialItemsPerPage: 10,
        //                 initialPage: 1
        //             }
        //         }
        //     }
        // };

        this.gridLoadMoreOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: (page: number, itemsPerPage: number, ordering: SimpleOrdering) =>
                        {
                            let dataLoader = this._gridLoadMore.getPlugin(DATA_LOADER) as DataLoader<DataResponse<any>>;
                            return this._getDataLoadMore(page, itemsPerPage, ordering, dataLoader);
                        }
                    }
                },
                paging:
                {
                    type: LoadMorePagingComponent,
                    options: <LoadMorePagingOptions>
                    {
                        initialItemsPerPage: 10,
                        initialPage: 1
                    }
                }
            }
        };

        this.gridContentScrollOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: (page: number, itemsPerPage: number, ordering: SimpleOrdering) =>
                        {
                            let dataLoader = this._gridContentScroll.getPlugin(DATA_LOADER) as DataLoader<DataResponse<any>>;
                            return this._getDataLoadMore(page, itemsPerPage, ordering, dataLoader);
                        }
                    }
                },
                paging:
                {
                    type: ContentVirtualScrollPagingComponent,
                    options: <ContentVirtualScrollPagingOptions>
                    {
                        initialItemsPerPage: 10,
                        initialPage: 1,
                        maxHeight: "300px"
                    }
                }
            }
        };

        this.gridPageScrollOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: (page: number, itemsPerPage: number, ordering: SimpleOrdering) =>
                        {
                            let dataLoader = this._gridPageScroll.getPlugin(DATA_LOADER) as DataLoader<DataResponse<any>>;
                            return this._getDataLoadMore(page, itemsPerPage, ordering, dataLoader);
                        }
                    }
                },
                paging:
                {
                    type: PageVirtualScrollPagingComponent,
                    options: <PageVirtualScrollPagingOptions>
                    {
                        initialItemsPerPage: 10,
                        initialPage: 1,
                        loadOffsetTreshold: 0.9
                    }
                }
            }
        };

        this.gridPreviousNextOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<any, SimpleOrdering>>
                    {
                        dataCallback: this._getData.bind(this)
                    }
                },
                paging:
                {
                    type: PreviousNextPagingComponent,
                    options: <PreviousNextPagingOptions>
                    {
                        initialItemsPerPage: 10,
                        initialPage: 1,
                        itemsPerPageValues: [10, 20, 50]
                    }
                }
            }
        };
    }

    //######################### public methods #########################

    /**
     * Sets page for first grid sample
     * @param {number} page Page to be set
     */
    public setPage(page: number)
    {
        this._sampleGrid.execute(setPage(page));
    }

    public test()
    {
        this.gridOptions.plugins.metadataSelector =
        {
            type: AdvancedMetadataSelectorComponent,
            options: <AdvancedMetadataSelectorOptions>
            {
                cookieName: 'sample-grid',
                texts:
                {
                    btnOpenSelection: 'VÝBER STĹPCOV',
                    titleAvailableColumns: 'Dostupné stĺpce'
                }
            }
        };

        this._sampleGrid.execute(reinitializeOptions(this.gridOptions));
    }

    //######################### private methods #########################

    /**
     * Callback used for obtaining data
     * @param  {number} page Index of requested page
     * @param  {number} itemsPerPage Number of items per page
     * @param  {TOrdering} ordering Order by column name
     */
    private async _getData(page: number, itemsPerPage: number, ordering: SimpleOrdering): Promise<DataResponse<any>>
    {
        let result = await this._dataSvc
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
}