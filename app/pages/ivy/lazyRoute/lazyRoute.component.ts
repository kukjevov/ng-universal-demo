import {Component, ChangeDetectionStrategy} from "@angular/core";
import {ComponentRoute} from "@ng/common/router";
import {GridOptions, TableContentRendererOptions, AsyncDataLoaderOptions, SimpleOrdering, BasicPagingOptions, QueryPagingInitializerComponent, DataResponse} from "@ng/grid";

import {ProvideClass} from "../provider";
import {GridDataService} from "../../../services/api/gridData/gridData.service";

@Component(
{
    selector: 'lazy-route-component',
    templateUrl: 'lazyRoute.component.html',
    providers: [GridDataService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: ''})
export class LazyRouteComponent
{
    public cond: boolean = false;
    public arrayObj: string[] = ['prvy', 'druhy', 'treti'];
    public type;

    /**
     * Grid options that are used for grid initialization
     */
    public gridOptions: GridOptions;

    constructor(provideClass: ProvideClass,
        private _grdDataSvc: GridDataService)
    {
        console.log("lazy", provideClass);
        import('../lazy.component').then(({LazyComponent}) => this.type = LazyComponent);

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