# @anglr/grid – Advanced Samples

Copy-pasteable patterns for common grid scenarios beyond the quick start. Pair with `plugins.md` for the underlying options.

## Table of contents

- [Ordering (sortable columns)](#ordering-sortable-columns)
- [Row selection with header-checkbox toggle](#row-selection-with-header-checkbox-toggle)
- [Metadata selector dialog (column visibility/ordering)](#metadata-selector-dialog-column-visibilityordering)
- [Master/detail (expandable rows)](#masterdetail-expandable-rows)
- [Customised view – list / gallery](#customised-view--list--gallery)
- [Rendering as a real HTML `<table>`](#rendering-as-a-real-html-table)
- [Legacy `<ng-grid>` setup](#legacy-ng-grid-setup)
- [Custom reactive data loader](#custom-reactive-data-loader)
- [Reusable overview / prehlad base class](#reusable-overview--prehlad-base-class)
- [Project-specific shortcut directive](#project-specific-shortcut-directive)

---

## Ordering (sortable columns)

Add the `orderable` attribute on the element inside `*headerCellTemplate`. The default `SingleOrderingComponent` handles direction toggling, ordering signals and triggers a re-fetch through the data loader.

```html
<div ngGrid [gridOptions]="gridOptions">
    <ng-container matrixGridColumn="country">
        <div *headerCellTemplate orderable class="flex-row"><div class="flex-1">Country</div></div>
        <div *contentCellTemplate="let row = datum">{{row.country}}</div>
    </ng-container>

    <ng-container matrixGridColumn="city">
        <div *headerCellTemplate orderable class="flex-row"><div class="flex-1">City</div></div>
        <div *contentCellTemplate="let row = datum">{{row.city}}</div>
    </ng-container>
</div>
```

Import `OrderableDirective` (or `MatrixGridModule`, which already re-exports it).

---

## Row selection with header-checkbox toggle

Pick `BasicRowSelectorComponent`, supply `getRowId` (and `getRowData` when the selected value differs from the row datum). Read selection state with the `selectedIds`/`selectedData` signals, or via `getSelectedData()` from extensions.

```typescript
import {Component, ChangeDetectionStrategy, Signal, WritableSignal, signal, viewChild, effect, inject, Injector} from '@angular/core';
import {AsyncDataLoaderOptions, BasicRowSelectorComponent, BasicRowSelectorOptions,
        DataResponse, Grid, GridOptions, GridPluginType, MatrixGridModule, RowSelector,
        SimpleOrdering} from '@anglr/grid';
import {areSelectedAllOnPage, invalidateContent, isSelectedAny, selectAllOnPage} from '@anglr/grid/extensions';
import {RecursivePartial} from '@jscrpt/common';

@Component(
{
    selector: 'row-selection-sample',
    templateUrl: 'rowSelectionSample.component.html',
    imports: [MatrixGridModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowSelectionSampleComponent
{
    private readonly _injector: Injector = inject(Injector);
    private readonly _dataSvc: DataService = inject(DataService);

    protected readonly selectedAll: WritableSignal<boolean> = signal(false);
    protected readonly selectedAny: WritableSignal<boolean> = signal(false);

    protected readonly gridOptions: RecursivePartial<GridOptions> =
    {
        plugins:
        {
            dataLoader:
            {
                options: <AsyncDataLoaderOptions<Address, SimpleOrdering>>
                {
                    dataCallback: (page, ipp, ordering) => this._getData(page, ipp, ordering),
                },
            },
            rowSelector:
            {
                type: BasicRowSelectorComponent,
                options: <BasicRowSelectorOptions<Citizen, Address, string>>
                {
                    getRowId: (data: Address) => data.id ?? 'MISSING ID!',
                    getRowData: (data: Address) => data.citizen ?? {},
                },
            },
        },
    };

    public readonly grid: Signal<Grid> = viewChild.required('grid');

    constructor()
    {
        effect(() =>
        {
            this.grid().initialized.subscribe(initialized =>
            {
                if(!initialized) return;

                effect(() =>
                {
                    const selector = this.grid().getPlugin<RowSelector<Citizen, Address, string>>(GridPluginType.RowSelector);
                    selector.selectedIds(); // subscribe

                    this.selectedAny.set(this.grid().executeAndReturn(isSelectedAny()));
                    this.selectedAll.set(this.grid().executeAndReturn(areSelectedAllOnPage()));
                }, {injector: this._injector});
            });
        });
    }

    protected toggleAllSelected(value: boolean): void
    {
        this.grid().execute(selectAllOnPage(value), invalidateContent());
    }
}
```

```html
<div ngGrid #grid [gridOptions]="gridOptions">
    <ng-container matrixGridColumn="selection" width="36px">
        <div *headerCellTemplate>
            <input type="checkbox"
                   (click)="toggleAllSelected($any($event.target).checked)"
                   [checked]="selectedAll()">
        </div>

        <div *contentCellTemplate="let datum = datum; let isSelected = isSelected; let plugins = plugins">
            <input type="checkbox"
                   (click)="plugins.rowSelector.selectItem(datum, $any($event.target).checked)"
                   [checked]="isSelected">
        </div>
    </ng-container>

    <ng-container matrixGridColumn="country">
        <div *headerCellTemplate>Country</div>
        <div *contentCellTemplate="let row = datum">{{row.country}}</div>
    </ng-container>
</div>
```

---

## Metadata selector dialog (column visibility/ordering)

Add the material plugin, mark the grid with a `selectionStore` namespace, and trigger the dialog from any button via `[showMetadataSelectorFor]`. Some columns can start hidden with `[visible]="false"`.

```typescript
import {AsyncDataLoaderOptions, DataResponse, GridOptions, MatrixGridModule,
        ShowMetadataSelectorForDirective, SimpleOrdering} from '@anglr/grid';
import {DialogMetadataSelectorOptions, SelectionStoreDirective} from '@anglr/grid/material';

// imports: [MatrixGridModule, SelectionStoreDirective, ShowMetadataSelectorForDirective]

protected readonly gridOptions: RecursivePartial<GridOptions> =
{
    plugins:
    {
        dataLoader: {options: <AsyncDataLoaderOptions<Address, SimpleOrdering>>{dataCallback: (p, ipp, o) => this._getData(p, ipp, o)}},
        metadataSelector: {options: <DialogMetadataSelectorOptions>{showButtonVisible: false}},
    },
};
```

```html
<button type="button" class="btn btn-primary" [showMetadataSelectorFor]="grid">
    Open Metadata Selector
</button>

<div ngGrid #grid [gridOptions]="gridOptions" selectionStore="metadataSelectionSample">
    <ng-container matrixGridColumn="country" title="Country">
        <div *headerCellTemplate>Country</div>
        <div *contentCellTemplate="let row = datum">{{row.country}}</div>
    </ng-container>

    <ng-container matrixGridColumn="name" title="Name" [visible]="false">
        <div *headerCellTemplate>Name</div>
        <div *contentCellTemplate="let row = datum">{{row.citizen.name}}</div>
    </ng-container>
</div>
```

Set the metadata selector plugin globally via `provideMetadataSelectorType(DialogMetadataSelectorComponent)` if you want every grid to use it.

---

## Master/detail (expandable rows)

Trick: declare `*contentRowContainerTemplate` **twice** on the same grid. The first occurrence reproduces the default row container (so the regular cells still render as a normal row), the second emits an extra full-width row gated by a flag on the row datum.

```typescript
export interface AddressDetail extends Address
{
    detailVisible?: boolean;
}
```

```html
<div ngGrid [gridOptions]="gridOptions">
    <ng-container matrixGridColumn="detailtoggle">
        <div *headerCellTemplate></div>
        <div *contentCellTemplate="let row = datum">
            <div class="up-down-caret-icon" [(closed)]="row.detailVisible"></div>
        </div>
    </ng-container>

    <ng-container matrixGridColumn="country">
        <div *headerCellTemplate>Country</div>
        <div *contentCellTemplate="let row = datum">{{row.country}}</div>
    </ng-container>

    <ng-container matrixGridColumn="city">
        <div *headerCellTemplate>City</div>
        <div *contentCellTemplate="let row = datum">{{row.city}}</div>
    </ng-container>

    <!-- 1. Keep the default per-row container so the regular cells still render -->
    <div contentRowContainer
         *contentRowContainerTemplate="let cssClasses = contentCssClasses"
         [class]="cssClasses.contentRowContainerClass"></div>

    <!-- 2. Full-width row, rendered only when the toggle is open -->
    <div *contentRowContainerTemplate="let datum = datum" class="grid-whole-row">
        @if(datum.detailVisible)
        {
            <div class="flex-column gap-small" animate.enter="slide-in" animate.leave="slide-out">
                <div class="flex-row gap-small">
                    <div class="italic">Name</div>
                    <div class="semi-bold">{{datum.citizen.name}}</div>
                </div>
            </div>
        }
    </div>
</div>
```

Notes:

- Toggle `detailVisible` on the datum (e.g. via a caret icon two-way binding) — no extra plugin is needed.
- Combine with the strongly-typed cell pattern in `SKILL.md` to get IntelliSense for `datum.citizen.name`.
- The detail row is plain Angular markup — `@if`/`@for`, animations, nested components all work.

---

## Customised view – list / gallery

The matrix renderer is template-based, so swapping `*contentRowContainerTemplate` (per-row) or `*contentContainerTemplate` (whole body) gives you list/gallery layouts while still benefiting from data loading, paging, ordering and selection.

```html
<!-- List view -->
<div ngGrid [gridOptions]="gridOptions">
    <div *headerContainerTemplate></div>

    <div *contentRowContainerTemplate="let datum = datum" class="grid-content-row-css-grid-custom">
        <div class="flex-row gap-small"><div class="italic">Country:</div><div class="bold">{{datum.country}}</div></div>
        <div class="flex-row gap-small"><div class="italic">City:</div><div class="bold">{{datum.city}}</div></div>
    </div>
</div>

<!-- Gallery view -->
<div ngGrid [gridOptions]="galleryGridOptions">
    <div *headerContainerTemplate></div>

    <div *contentContainerTemplate="let data = data" class="gallery-div">
        @for(datum of data; track datum)
        {
            <div class="image-div" [style.backgroundImage]="`url(${datum.source})`"></div>
        }
    </div>
</div>
```

Replacing `*contentContainerTemplate` gives you the whole body — iterate `data` yourself.

---

## Rendering as a real HTML `<table>`

Add the `useTable` directive to make the matrix renderer emit `<table>`/`<thead>`/`<tbody>`. Cell templates should use `<th>`/`<td>` so the output is valid HTML.

```html
<table ngGrid [gridOptions]="gridOptions" useTable>
    <ng-container matrixGridColumn="country">
        <th *headerCellTemplate>Country</th>
        <td *contentCellTemplate="let row = datum">{{row.country}}</td>
    </ng-container>

    <ng-container matrixGridColumn="city">
        <th *headerCellTemplate>City</th>
        <td *contentCellTemplate="let row = datum">{{row.city}}</td>
    </ng-container>
</table>
```

---

## Legacy `<ng-grid>` setup

Use only when extending older code; for new grids prefer the matrix grid. Columns are declared via dedicated metadata components.

```typescript
import {AsyncDataLoaderOptions, BasicPagingOptions, DataResponse, GridModule, GridOptions, SimpleOrdering} from '@anglr/grid';
// imports: [GridModule]

protected readonly gridOptions: RecursivePartial<GridOptions> =
{
    plugins:
    {
        dataLoader: {options: <AsyncDataLoaderOptions<Address, SimpleOrdering>>{dataCallback: (p, ipp, o) => this._getData(p, ipp, o)}},
        paging:     {options: <BasicPagingOptions>{itemsPerPageValues: [5, 10, 20], initialItemsPerPage: 5}},
    },
};
```

```html
<ng-grid [gridOptions]="gridOptions">
    <basic-table-metadata>
        <basic-table-column id="country" name="country" title="Country"></basic-table-column>
        <basic-table-column id="city"    name="city"    title="City"></basic-table-column>
        <basic-table-column id="zip"     name="zip"     title="ZIP"></basic-table-column>
    </basic-table-metadata>
</ng-grid>
```

---

## Custom reactive data loader

Plug in a custom data loader (see `plugins.md` → *Authoring a custom plugin* for the component itself) that reads other plugins' signals to recompute on every change of paging/ordering.

```typescript
import {GridOptions, MatrixGridModule, Ordering, SimpleOrdering} from '@anglr/grid';
import {ReactiveDataLoaderComponent} from '../../../plugins/reactiveDataLoader.component';
import {ReactiveDataLoaderOptions} from '../../../plugins/reactiveDataLoader.interface';

protected readonly gridOptions: RecursivePartial<GridOptions> =
{
    plugins:
    {
        dataLoader:
        {
            type: ReactiveDataLoaderComponent,
            options: <ReactiveDataLoaderOptions<Address, SimpleOrdering>>
            {
                data: async plugins =>
                {
                    const paging = plugins.paging;
                    const ordering = plugins.ordering as Ordering<SimpleOrdering>;

                    const result = await lastValueFrom(this._dataSvc.getData(
                        {page: paging.page() ?? 1, size: paging.itemsPerPage() ?? 15},
                        ordering.ordering()));

                    return {data: result?.content ?? [], totalCount: result?.totalElements ?? 0};
                },
            },
        },
    },
};
```

---

## Reusable overview / prehlad base class

Encapsulate the common parts of every "list" page – grid + filter form + URL persistence – in a base directive. Concrete pages then only implement `defaultFilterValue` and `getPrehlad(...)`.

```typescript
import {Directive, ViewChild, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormModelBuilder, FormModelGroup} from '@anglr/common/forms';
import {AsyncDataLoaderOptions, DataResponse, Grid, GridOptions, SimpleOrdering} from '@anglr/grid';
import {refreshData, resetSelection, setPage} from '@anglr/grid/extensions';
import {BindThis, Pageable, PagedData, RecursivePartial, serializeToUrlQuery} from '@jscrpt/common';
import {lastValueFrom} from '@jscrpt/common/rxjs';
import {Observable} from 'rxjs';

@Directive()
export abstract class BasePrehladComponent<TFilter extends Record<string, unknown>, TDataItem> implements OnInit
{
    protected route: ActivatedRoute = inject(ActivatedRoute);
    protected router: Router = inject(Router);
    protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected formModelBuilder: FormModelBuilder = inject(FormModelBuilder);

    protected currentPaging: Pageable | undefined;
    protected currentOrdering: SimpleOrdering | undefined | null;

    public gridOptions: RecursivePartial<GridOptions>;
    public filter!: FormGroup<FormModelGroup<TFilter>>;

    @ViewChild('grid')
    public grid?: Grid;

    protected abstract get defaultFilterValue(): TFilter;

    constructor()
    {
        this.gridOptions =
        {
            plugins:
            {
                dataLoader:
                {
                    options: <AsyncDataLoaderOptions>
                    {
                        dataCallback: this.getData,
                        autoLoadData: false,           // wait until the user presses Search
                    },
                },
            },
        };
    }

    public ngOnInit(): void
    {
        this.filter = this.formModelBuilder.build(this.defaultFilterValue);
    }

    public refreshGrid(): void
    {
        this.grid?.execute(refreshData(true));
    }

    public refreshGridToDefaults(): void
    {
        this.grid?.execute(setPage(1), refreshData(true));
        this.grid?.execute(resetSelection());
    }

    public async search(): Promise<void>
    {
        await this.router.navigate(['.', {filter: serializeToUrlQuery(this.filter?.value), searched: true}],
            {relativeTo: this.route, queryParamsHandling: 'merge', replaceUrl: true});

        this.refreshGridToDefaults();
    }

    @BindThis
    protected async getData(page: number, itemsPerPage: number, ordering: SimpleOrdering | undefined | null): Promise<DataResponse<TDataItem>>
    {
        this.currentPaging = {page: page - 1, size: itemsPerPage};
        this.currentOrdering = ordering;

        const result = await lastValueFrom(this.getPrehlad(this.currentPaging, ordering, this.filter?.value as TFilter));

        return {data: result?.content ?? [], totalCount: result?.totalElements ?? 0};
    }

    protected abstract getPrehlad(paging: Pageable, ordering: SimpleOrdering | undefined | null, filter: TFilter): Observable<PagedData<TDataItem>>;
}
```

---

## Project-specific shortcut directive

If the app frequently wires the same `SyncDataLoaderComponent` + `BasicPagingComponent` + `NoMetadataSelectorComponent` combination, encapsulate it in a project directive that mirrors the shape of the built-in `GridDataDirective` but adds paging.

```typescript
import {Directive, Input, OnChanges, SimpleChanges, inject} from '@angular/core';
import {BasicPagingComponent, BasicPagingOptions, DataLoader, GRID_INSTANCE, Grid, GridPluginType,
        NoMetadataSelectorComponent, SyncDataLoaderComponent, SyncDataLoaderOptions} from '@anglr/grid';
import {RecursivePartial, nameof} from '@jscrpt/common';
import {lastValueFrom} from '@jscrpt/common/rxjs';
import {first} from 'rxjs';

@Directive({selector: '[ngGrid][pagedData]'})
export class BasicPagingGridDataDirective<TData = unknown> implements OnChanges
{
    private readonly _grid: Grid = inject(GRID_INSTANCE);

    @Input('pagedData')
    public data: TData[] | undefined | null;

    constructor()
    {
        this._grid.gridOptions =
        {
            plugins:
            {
                dataLoader:       {type: SyncDataLoaderComponent, options: <RecursivePartial<SyncDataLoaderOptions<TData>>>{data: []}},
                paging:           {type: BasicPagingComponent,    options: <BasicPagingOptions>{initialItemsPerPage: 15}},
                metadataSelector: {type: NoMetadataSelectorComponent},
            },
        };
    }

    public async ngOnChanges(changes: SimpleChanges): Promise<void>
    {
        if(nameof<BasicPagingGridDataDirective>('data') in changes)
        {
            await lastValueFrom(this._grid.initialized.pipe(first(itm => itm)));

            const data = this.data ?? [];

            this._grid.execute(grid =>
            {
                const dataLoader = grid.getPlugin<DataLoader>(GridPluginType.DataLoader);
                (dataLoader.options as SyncDataLoaderOptions).data = Array.isArray(data) ? data : [];
                dataLoader.loadData();
            });
        }
    }
}
```

Inject `GRID_INSTANCE` to get the host `Grid` from inside a directive applied to `<div ngGrid>`. Wait for `grid.initialized` before executing actions that touch plugin state.
