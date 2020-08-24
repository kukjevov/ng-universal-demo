import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from "@anglr/common/router";
import {Authorize, AuthGuard} from '@anglr/authentication';
import {GridOptions, AsyncDataLoaderOptions, SimpleOrdering, TableContentRendererOptions, DataResponse} from '@anglr/grid';
import {BindThis} from '@jscrpt/common';
import {of} from 'rxjs';

import {AdvancedDetailTableBodyContentRendererComponent, AdvancedDetailTableBodyContentRendererOptions} from '../../modules';

interface Data
{
    storno?: boolean;
    faza?: string;
    id?: string;
    nazov?: string;
    typ?: string;
}

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize("home-page")
export class HomeComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Options for grid
     */
    public gridOptions: GridOptions;

    //######################### constructor #########################
    constructor()
    {
        this.gridOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions<Data, SimpleOrdering>>
                    {
                        dataCallback: this._getData
                    }
                },
                contentRenderer:
                {
                    options: <TableContentRendererOptions>
                    {
                        plugins:
                        {
                            bodyRenderer:
                            {
                                type: AdvancedDetailTableBodyContentRendererComponent,
                                options: <AdvancedDetailTableBodyContentRendererOptions>
                                {
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    
    //######################### private methods #########################

    /**
     * Callback used for obtaining data
     * @param page Index of requested page
     * @param itemsPerPage Number of items per page
     * @param ordering Order by column name
     */
    @BindThis
    private async _getData(page: number, itemsPerPage: number, ordering: SimpleOrdering): Promise<DataResponse<Data>>
    {
        //MOCK DATA
        let result = await of(
        [
            {
                storno: true,
                faza: 'faza-1',
                id: 'id-1',
                nazov: 'nazov-1',
                typ: 'typ-1'
            },
            {
                storno: false,
                faza: 'faza-2',
                id: 'id-2',
                nazov: 'nazov-2',
                typ: 'typ-2'
            }
        ]).toPromise();

        return {
            data: result,
            totalCount: result.length
        };
    }
}
