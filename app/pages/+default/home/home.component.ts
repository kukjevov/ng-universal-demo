import {Component, ChangeDetectionStrategy} from '@angular/core';
import {NgClass} from '@angular/common';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {DebugDataCopyClickModule} from '@anglr/common/material';
import {GridOptions, MatrixGridModule, SyncDataLoaderOptions, SyncDataLoaderSAComponent} from '@anglr/grid';
import {RecursivePartial} from '@jscrpt/common';

const data =
[
    {
        id: 10,
        name: 'name',
        surname: 'surname'
    },
    {
        id: 20,
        name: 'name111',
        surname: 'surname111'
    },
    {
        id: 50,
        name: 'name222',
        surname: 'surname333'
    },
    {
        id: 40,
        name: 'name444',
        surname: 'surnam555e'
    }
];

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    standalone: true,
    imports:
    [
        DebugDataCopyClickModule,
        MatrixGridModule,
        NgClass,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
    public gridOptions: RecursivePartial<GridOptions> =
    {
        plugins:
        {
            dataLoader:
            {
                type: SyncDataLoaderSAComponent,
                options: <SyncDataLoaderOptions>
                {
                    data: data,
                }
            }
        }
    };
}
