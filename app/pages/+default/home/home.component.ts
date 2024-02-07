import {Component, ChangeDetectionStrategy, signal, computed, ViewChild, Injector} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {AttachPluginsSADirective, BasicPagingOptions, BasicPagingSAComponent, Grid, GridDataRowContext, GridOptions, MatrixGridModule, PreviousNextPagingSAComponent, ShowMetadataSelectorForSADirective, SimpleOrdering, SyncDataLoaderOptions, SyncDataLoaderSAComponent, UseTableSADirective} from '@anglr/grid';
import {invalidateContent, patchOptions, patchPluginsOptions, reinitialize, reinitializeOptions} from '@anglr/grid/extensions';
import {provideHttpClientErrorMessages} from '@anglr/error-handling';
import {DialogMetadataSelectorOptions, DialogMetadataSelectorSAComponent} from '@anglr/grid/material';
import {AsSignal} from '@anglr/common';
import {MarkdownModule} from '@anglr/md-help/web';
import {RecursivePartial} from '@jscrpt/common';
import {lastValueFrom} from '@jscrpt/common/rxjs';

import {ErrorService} from '../../../services/api/error';
import {DebuggingFeatureModule, DisplayingFeatureModule, FormsFeatureModule} from '../../../modules';

const data =
[
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Banská Bystrica',
        'zip': '97401',
        'street': 'Janka Chalupku',
        'houseNumber': '13',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Bratislava',
        'zip': '82109',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo II',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Košice',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'George',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Banská Bystrica',
        'zip': '97404',
        'street': 'Janka Chalupku',
        'houseNumber': '13',
        'citizen':
        {
            'name': 'John',
            'surname': 'Wick',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Lučenec',
        'zip': '82109',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Poprad',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Banská Bystrica',
        'zip': '12345',
        'street': 'Janka Chalupku',
        'houseNumber': '131',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2002-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Trenčín',
        'zip': '82109',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2005-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Poltár',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '1990-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Zvolen',
        'zip': '97401',
        'street': 'Janka Chalupku',
        'houseNumber': '13',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Bratislava',
        'zip': '82109',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Košice',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Banská Bystrica',
        'zip': '97401',
        'street': 'Janka Chalupku',
        'houseNumber': '13',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Bratislava',
        'zip': '98752',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Košice',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Banská Bystrica',
        'zip': '97401',
        'street': 'Janka Chalupku',
        'houseNumber': '13',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Bratislava',
        'zip': '82109',
        'street': 'Trenčianska',
        'houseNumber': '156/A',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
    },
    {
        detail: false,
        'country': 'Slovakia',
        'city': 'Košice',
        'zip': '04011',
        'street': 'Werferova',
        'houseNumber': '11',
        'citizen':
        {
            'name': 'John',
            'surname': 'Rambo',
            'birthDate': '2000-02-04T10:15:30'
        }
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
        DisplayingFeatureModule,
        FormsFeatureModule,
        DebuggingFeatureModule,
        MatrixGridModule,
        MarkdownModule,
        UseTableSADirective,
        AttachPluginsSADirective,
        BasicPagingSAComponent,
        DialogMetadataSelectorSAComponent,
        ShowMetadataSelectorForSADirective,
    ],
    providers:
    [
        ErrorService,
        provideHttpClientErrorMessages({404: 'záznam je fuč'})
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Grid options that are used for grid initialization
     */
    public gridOptions: RecursivePartial<GridOptions>;

    public first = signal(10);

    @AsSignal()
    public second = 20;

    public ipp = 5;

    public basic = true;

    public computed = computed(() =>
    {
        const first = this.first();
        const second = this.second;

        console.log('this is from init', first + second);

        return first + second;
    });

    @ViewChild('grid')
    protected grid: Grid|undefined|null;

    //######################### constructor #########################
    constructor(private _errorSvc: ErrorService,
                protected injector: Injector,)
    {
        this.gridOptions =
        {
            autoInitialize: true,
            plugins:
            {
                dataLoader:
                {
                    //use sync data loader as grid data loader plugin
                    type: SyncDataLoaderSAComponent,
                    options: <SyncDataLoaderOptions<unknown, SimpleOrdering>>
                    {
                        //all data used in data loader
                        data: data,
                        //custom ordering, does not have to be specified, defaults to function that orders using string ordering
                    }
                },
                paging:
                {
                    type: BasicPagingSAComponent,
                    options: <BasicPagingOptions>
                    {
                        //available values for items per page buttons
                        itemsPerPageValues: [15, 30, 60],
                        //initial value of items per page, should be one of above
                        // initialItemsPerPage: 15
                    }
                },
                metadataSelector:
                {
                    options: <DialogMetadataSelectorOptions>
                    {
                    }
                }
            }
        };

        toObservable(this.first).subscribe(first =>
        {
            const second = this.second;

            console.log(`running ${first} ${second}`);
        });

        console.log('after toObservable');

        setTimeout(() =>
        {
            this.computed = computed(() =>
            {
                const first = this.first();
                const second = this.second;
    
                console.log('this is from ctor', first + second);
    
                return first + second;
            });
        }, 5000);
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    public async call400(): Promise<void>
    {
        console.log('before 400');

        try
        {
            const result = await lastValueFrom(this._errorSvc
                .call400());

            console.log('after 400', result);
        }
        catch(e)
        {
            console.log('after 400 error', e);
        }
    }

    public async call404(): Promise<void>
    {
        console.log('before 404');

        try
        {
            const result = await lastValueFrom(this._errorSvc
                .call404());

            console.log('after 404', result);
        }
        catch(e)
        {
            console.log('after 404 error', e);
        }
    }

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit(): void
    {
        // this.grid?.execute(reinitializeOptions());
    }

    public incFirst(): void
    {
        this.first.update(x => x+1);
    }

    public incSecond(): void
    {
        this.second += 1;
    }

    public patchOptions(): void
    {
        this.grid?.execute(patchPluginsOptions(
        {
            plugins:
            {
                paging:
                {
                    options: <RecursivePartial<BasicPagingOptions>>
                    {
                        itemsPerPageValues: [this.ipp]
                    }
                }
            }
        }));

        this.ipp *= 2;
    }

    public patchOptionsGrid(): void
    {
        this.grid?.execute(patchOptions({}));
    }

    public reinitialize(): void
    {
        this.grid?.execute(reinitialize());
    }

    public reinitializeOptions(): void
    {
        this.grid?.execute(reinitializeOptions());
    }

    public togglePaging(): void
    {
        this.basic = !this.basic;

        this.grid?.execute(reinitializeOptions(
        {
            plugins:
            {
                paging:
                {
                    type: this.basic ? BasicPagingSAComponent : PreviousNextPagingSAComponent,
                    instance: null,
                }
            }
        }));
    }

    public detailPredicate(rowContext: GridDataRowContext<{detail: boolean}>): boolean
    {
        return rowContext.datum.detail;
    }

    public toggleDetail(data: {detail: boolean}): void
    {
        data.detail = !data.detail;

        this.grid?.execute(invalidateContent());
    }
}
