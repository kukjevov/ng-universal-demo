import {Directive, inject, signal, WritableSignal, untracked, viewChild, Signal, computed, effect} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FieldState, FieldTree, form} from '@angular/forms/signals';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GridOptions, SimpleOrdering, Grid, createReactiveDataLoaderOptions, ReactiveDataLoader} from '@anglr/grid';
import {setPage, refreshData, resetSelection, getPage, getItemsPerPage, getOrdering} from '@anglr/grid/extensions';
import {GlobalNotificationsService} from '@anglr/notifications';
import {readEncodedFilter} from '@anglr/common/forms';
import {serializeToUrlQuery, PagedData, RecursivePartial} from '@jscrpt/common';
import {deepCopyWithArrayOverride} from '@jscrpt/common/lodash';
import {map, Observable} from 'rxjs';

import {GridPaging} from '../../interfaces';

/**
 * Base class for all "prehlad" pages
 */
@Directive()
export abstract class BaseSignalsPrehladComponent<TFilter extends Record<string, any>, TDataItem>
{
    //######################### private fields #########################

    /**
     * Backing field for gridOptions property
     */
    private _gridOptions: WritableSignal<RecursivePartial<GridOptions>> = signal({});

    //######################### protected fields #########################

    /**
     * Service used for displaying notifications
     */
    protected notifications: GlobalNotificationsService = inject(GlobalNotificationsService);

    /**
     * Instance of current route
     */
    protected route: ActivatedRoute = inject(ActivatedRoute);

    /**
     * Instance of router
     */
    protected router: Router = inject(Router);

    /**
     * Current paging of grid
     */
    protected gridPaging: Signal<GridPaging> = computed(() => ({page: this.grid().executeAndReturn(getPage()), itemsPerPage: this.grid().executeAndReturn(getItemsPerPage())}));

    /**
     * Current ordering of grid
     */
    protected gridOrdering: Signal<SimpleOrdering|undefined|null> = computed(() => this.grid().executeAndReturn(getOrdering<SimpleOrdering>()));

    /**
     * Current route params
     */
    protected routeParams: Signal<Params> = toSignal(this.route.params, {initialValue: {} as Params});

    /**
     * Indication whether was grid initialized
     */
    protected gridInitialized: Signal<boolean> = computed(() => this.grid().initializedSignal());

    //######################### protected properties - template bindings #########################

    /**
     * Options for grid
     */
    protected get gridOptions(): RecursivePartial<GridOptions>
    {
        return this._gridOptions();
    }
    protected set gridOptions(value: RecursivePartial<GridOptions>)
    {
        this._gridOptions.set(deepCopyWithArrayOverride({}, untracked(() => this._gridOptions()), value));
    }

    /**
     * Form model for filter form
     */
    protected filterFormModel: WritableSignal<TFilter> = signal({} as TFilter);

    /**
     * Filter form field tree
     */
    protected filter: FieldTree<TFilter> = form(this.filterFormModel);

    /**
     * State of filter form
     */
    protected get filterState(): FieldState<TFilter>
    {
        return this.filter();
    }

    //######################### protected properties #########################

    /**
     * Gets default value of filter
     */
    protected abstract get defaultFilterValue(): TFilter;

    //######################### protected properties - children #########################

    /**
     * Instance of grid component
     */
    protected grid: Signal<Grid> = viewChild.required('grid');

    //######################### constructors #########################
    constructor()
    {
        const filterRouteParamEncoded = computed(() => this.routeParams().filter as string|undefined|null);
        const filterRouteParam = computed(() =>
        {
            const filter = filterRouteParamEncoded();

            return filter ? readEncodedFilter(untracked(() => this.filterState.value()), filter ?? '') as TFilter : null;
        });

        effect(() =>
        {
            const filter = filterRouteParam();

            if(filter)
            {
                this.filterState.value.set(filter);
            }
        });

        this.gridOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    type: ReactiveDataLoader,
                    options: createReactiveDataLoaderOptions(
                    {
                        getParams: () =>
                        {
                            return {
                                paging: this.gridPaging(),
                                ordering: this.gridOrdering(),
                            };
                        },
                        data: params => this.getPrehlad(params.paging, params.ordering, untracked(() => this.filterState.value()))
                            .pipe(map(result =>
                            {
                                return {
                                    data: result?.content ?? [],
                                    totalCount: result?.totalElements ?? 0,
                                };
                            })),
                    }),
                },
            },
        };
    }

    //######################### protected methods - template bindings #########################

    /**
     * Refresh to defaults grid content
     */
    protected refreshGridToDefaults(): void
    {
        this.grid().execute(setPage(1),
                            refreshData(true));

        this.grid().execute(resetSelection());
    }

    /**
     * Refresh grid data
     */
    protected refreshGrid(): void
    {
        this.grid().execute(refreshData(true));
    }

    /**
     * Resets filter to its default value
     *
     * @param override - Optional value that will override default value of filter
     */
    protected async resetFilter(override?: Partial<TFilter>): Promise<void>
    {
        this.filterState.reset({...this.defaultFilterValue, ...override});

        await this.router.navigate(['.'],
                                   {
                                       relativeTo: this.route,
                                       queryParamsHandling: 'merge',
                                       replaceUrl: true,
                                   });

        this.refreshGridToDefaults();
    }

    /**
     * Runs search
     */
    protected async search(): Promise<void>
    {
        await this.router.navigate(['.', {filter: serializeToUrlQuery(this.filterState.value())}],
                                   {
                                       relativeTo: this.route,
                                       queryParamsHandling: 'merge',
                                       replaceUrl: true,
                                   });

        this.refreshGridToDefaults();
    }

    //######################### protected methods #########################

    /**
     * Gets data for prehlad
     * @param paging - Information about requested paging
     * @param ordering - Information about requested ordering
     * @param filter - Information about requested filter
     */
    protected abstract getPrehlad(paging: GridPaging,
                                  ordering: SimpleOrdering|undefined|null,
                                  filter: TFilter): Observable<PagedData<TDataItem>>;
}
