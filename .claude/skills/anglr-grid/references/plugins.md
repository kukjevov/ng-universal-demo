# @anglr/grid – Plugin Reference

This file documents every plugin slot, its built-in implementations, options, and the interface to implement when authoring a custom plugin. Consult the slot you need — they're independent.

## Table of contents

- [GridPlugin base interface](#gridplugin-base-interface)
- [DataLoader](#dataloader)
- [Paging](#paging)
- [Ordering](#ordering)
- [ContentRenderer](#contentrenderer)
- [MetadataSelector](#metadataselector)
- [NoDataRenderer](#nodatarenderer)
- [RowSelector](#rowselector)
- [GridInitializer](#gridinitializer)
- [Authoring a custom plugin](#authoring-a-custom-plugin)

---

## GridPlugin base interface

Every plugin implements this. Specialised plugin interfaces (`DataLoader`, `Paging`, …) extend it.

```typescript
interface GridPlugin<TOptions = unknown> extends Invalidatable
{
    gridPlugins: GridPluginInstances | undefined | null;   // injected via inject(GRID_PLUGIN_INSTANCES)
    readonly pluginElement: ElementRef<HTMLElement>;

    get options(): TOptions;
    set options(value: RecursivePartial<TOptions>);

    initialize(force: boolean): PromiseOr<void>;
    initOptions(): PromiseOr<void>;
}
```

Plugins are full Angular components — they have a template (which may be empty for invisible plugins like data loaders), can inject services, and participate in change detection. Use `ChangeDetectionStrategy.OnPush`.

Shared infrastructure:

- `GRID_PLUGIN_INSTANCES` injection token → `GridPluginInstances` (keys: `dataLoader`, `paging`, `ordering`, `contentRenderer`, `metadataSelector`, `noDataRenderer`, `rowSelector`, `gridInitializer`).
- `GridPluginType` enum used with `grid.getPlugin<T>(GridPluginType.DataLoader)`.
- `Invalidatable.invalidateVisuals()` – called by the framework when a plugin should re-render.

---

## DataLoader

Loads data and exposes the result + state as signals.

```typescript
interface DataLoader<TResult = unknown, TOptions = unknown> extends GridPlugin<TOptions>
{
    readonly result: Signal<TResult>;
    readonly state: Signal<DataLoaderState>;   // NotLoadedYet | DataLoading | Loaded | NoData
    loadData(force?: boolean): PromiseOr<void>;
}
```

Shared base options:

```typescript
interface DataLoaderOptions
{
    autoLoadData: boolean;          // default true
    accumulateData: boolean;        // append new pages to existing data (infinite scroll); default false
    debounceDataCallback: number;   // ms; default 30
}
```

### AsyncDataLoaderComponent (default)

```typescript
interface AsyncDataLoaderOptions<TData = unknown, TOrdering = unknown> extends DataLoaderOptions
{
    dataCallback: (page: number, itemsPerPage: number, ordering: TOrdering) => Promise<DataResponse<TData>> | Observable<DataResponse<TData>>;
}

interface DataResponse<TData>
{
    data: TData[];
    totalCount: number;
}
```

Automatically re-invokes `dataCallback` when paging or ordering signals change.

### SyncDataLoaderComponent

```typescript
interface SyncDataLoaderOptions<TData = unknown, TOrdering = unknown> extends DataLoaderOptions
{
    data: TData[];
    orderData?: (data: TData[], ordering: TOrdering) => TData[];   // optional custom sort
}
```

Use via `[ngGrid][data]` (`GridDataDirective`) for the common case, or instantiate directly when you need `orderData` / `accumulateData`.

---

## Paging

```typescript
interface Paging<TOptions = unknown> extends GridPlugin<TOptions>
{
    readonly page: Signal<number | undefined | null>;
    readonly itemsPerPage: Signal<number | undefined | null>;
    readonly totalCount: WritableSignal<number | undefined | null>;
    readonly displayedItemsCount: Signal<number>;
}
```

| Component | Options interface | Notes |
| --- | --- | --- |
| `BasicPagingComponent` (default) | `BasicPagingOptions` (`pagesDispersion`, `itemsPerPageValues`, `initialItemsPerPage`) | Classic numbered pager + items-per-page picker. |
| `PreviousNextPagingComponent` | `PreviousNextPagingOptions` | `« ‹ › »` style. |
| `LoadMorePagingComponent` | `LoadMorePagingOptions` (`initialItemsPerPage`, button text) | Use with `accumulateData: true` for "load more" / infinite scroll. |
| `NoPagingComponent` | – | Disables paging entirely. Pair with sync data when you want a flat list. |
| `CdkVirtualScrollPagingComponent` *(`@anglr/grid/material`)* | – | Windowed virtual paging on top of `@angular/cdk/scrolling`. |

---

## Ordering

```typescript
interface Ordering<TOrdering = unknown, TOptions = unknown> extends GridPlugin<TOptions>
{
    readonly ordering: Signal<TOrdering | undefined | null>;
    orderByColumn(columnId: string): void;
}
```

| Component | Ordering type | Notes |
| --- | --- | --- |
| `SingleOrderingComponent` (default) | `SimpleOrdering = {orderBy: string; orderByDirection: 'asc' \| 'desc'}` | Single-column sort. |
| `NoOrderingComponent` | – | Disables sorting. |

Make a header sortable by adding the `orderable` attribute on the element inside `*headerCellTemplate`. The directive talks to the ordering plugin directly.

---

## ContentRenderer

Renders the body (and usually header/footer). Most customisation in matrix grids happens via templates, not by swapping this plugin.

| Component | Notes |
| --- | --- |
| `MatrixContentRendererComponent` (default for matrix grid) | CSS-grid driven, fully template-customisable through `*headerContainerTemplate`, `*contentContainerTemplate`, `*headerRowContainerTemplate`, `*contentRowContainerTemplate`, `*footerContainerTemplate`, `*footerRowContainerTemplate`, `*gridContainerTemplate`, `*headerCellTemplate`, `*contentCellTemplate`, `*footerCellTemplate`. |
| `TableContentRendererComponent` (default for legacy grid) | Renders into a real `<table>`. |
| `CssDivsContentRendererComponent` | `<div>` based with CSS classes (no CSS grid). |
| `VirtualScrollTableContentRendererComponent` *(`@anglr/grid/material`)* | Table renderer combined with virtual scroll. |

Most options expose a `cssClasses` map (e.g. `TableContentRendererOptions.cssClasses.containerDiv`) so you can apply project-wide styling via DI.

The `useTable` attribute on `<table ngGrid useTable>` instructs the matrix renderer to emit `<table>/<thead>/<tbody>` instead of `<div>`s.

---

## MetadataSelector

Lets the user reorder and toggle column visibility.

| Component | Notes |
| --- | --- |
| `NoMetadataSelectorComponent` (default) | Forwards columns as declared. |
| `DialogMetadataSelectorComponent` *(`@anglr/grid/material`)* | Opens a Material dialog. Options: `DialogMetadataSelectorOptions` (`showButtonVisible`, dialog config, …). Combine with `selectionStore="<name>"` on the grid and `QueryPermanentStorageGridInitializerComponent` to persist choices. |

Trigger the dialog from any element via `[showMetadataSelectorFor]="grid"`.

---

## NoDataRenderer

Placeholder shown when there are no data.

| Component | Options |
| --- | --- |
| `SimpleNoDataRendererComponent` (default) | `texts: {notLoaded, loading, noData}` strings (each is shown in the matching `DataLoaderState`). |

---

## RowSelector

Tracks selected rows.

```typescript
interface RowSelector<TSelected = unknown, TData = unknown, TId = unknown, TOptions = unknown> extends GridPlugin<TOptions>
{
    readonly selectedIds: Signal<TId[]>;
    readonly selectedData: Signal<TSelected[]>;
    selectItem(data: TData, select: boolean): void;
    resetSelection(): void;
}
```

| Component | Options |
| --- | --- |
| `NoRowSelectorComponent` (default) | – |
| `BasicRowSelectorComponent` | `BasicRowSelectorOptions<TSelected, TData, TId>` – `getRowId(data)`, `getRowData(data)` (defaults to identity). |
| `LimitedRowSelectorComponent` | `LimitedRowSelectorOptions` – adds `limit: number`. |

Read selection imperatively via the `getSelectedData()` action from `@anglr/grid/extensions`, or reactively via the plugin's signals inside an `effect()`.

---

## GridInitializer

Provides the initial page / items-per-page / ordering and optionally persists them.

| Component | Notes |
| --- | --- |
| `NoGridInitializerComponent` (default) | Nothing. |
| `QueryGridInitializerComponent` | Reads/writes state to/from URL query params. |
| `QueryPermanentStorageGridInitializerComponent` | URL + permanent storage (via `@anglr/common`). Options: `QueryPermanentStorageGridInitializerOptions` (`storageIppName` – the key under which `itemsPerPage` is persisted). |

Usually configured globally via `provideGridInitializerType(...)`.

---

## Authoring a custom plugin

A plugin is a standalone Angular component implementing the relevant interface. Inject `GRID_PLUGIN_INSTANCES` to react to other plugins' signals.

Below: a reactive data loader that recomputes its data on every change of paging/ordering (the same one used in the reactive-data sample in `samples.md`).

```typescript
import {Component, ChangeDetectionStrategy, ElementRef, Signal, WritableSignal, signal, computed, inject} from '@angular/core';
import {DATA_LOADER_OPTIONS, DataLoader, DataLoaderOptions, DataLoaderState, DataResponse,
        GRID_PLUGIN_INSTANCES, GridPluginInstances} from '@anglr/grid';
import {RecursivePartial} from '@jscrpt/common';

export interface ReactiveDataLoaderOptions<TData = unknown, TOrdering = unknown> extends DataLoaderOptions
{
    data: (plugins: GridPluginInstances) => Promise<DataResponse<TData>>;
}

const DEFAULT_OPTIONS: ReactiveDataLoaderOptions =
{
    autoLoadData: true,
    accumulateData: false,
    debounceDataCallback: 30,
    data: async () => ({data: [], totalCount: 0}),
};

@Component(
{
    selector: 'ng-reactive-data-loader',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveDataLoaderComponent<TData = unknown, TOrdering = unknown>
    implements DataLoader<DataResponse<TData>, ReactiveDataLoaderOptions<TData, TOrdering>>
{
    protected readonly _result: WritableSignal<DataResponse<TData>> = signal({data: [], totalCount: 0});

    protected readonly _state: WritableSignal<DataLoaderState> = signal(DataLoaderState.NotLoadedYet);

    protected _options: ReactiveDataLoaderOptions<TData, TOrdering> =
        {...DEFAULT_OPTIONS, ...(inject(DATA_LOADER_OPTIONS, {optional: true}) ?? {})} as ReactiveDataLoaderOptions<TData, TOrdering>;

    public gridPlugins: GridPluginInstances | null | undefined = inject(GRID_PLUGIN_INSTANCES, {optional: true});

    public readonly pluginElement: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    public get options(): ReactiveDataLoaderOptions<TData, TOrdering>
    {
        return this._options;
    }
    public set options(value: RecursivePartial<ReactiveDataLoaderOptions<TData, TOrdering>>)
    {
        this._options = {...this._options, ...value} as ReactiveDataLoaderOptions<TData, TOrdering>;
    }

    public readonly result: Signal<DataResponse<TData>> = computed(() => this._result());

    public get state(): Signal<DataLoaderState>
    {
        return this._state.asReadonly();
    }

    public initOptions(): void
    {
    }

    public async initialize(_force: boolean): Promise<void>
    {
        if(this._options.autoLoadData)
        {
            await this.loadData();
        }
    }

    public invalidateVisuals(): void
    {
    }

    public async loadData(_force?: boolean): Promise<void>
    {
        if(!this.gridPlugins)
        {
            return;
        }

        this._state.set(DataLoaderState.DataLoading);

        const response = await this._options.data(this.gridPlugins);

        this._result.set(response);
        this._state.set(response.data.length ? DataLoaderState.Loaded : DataLoaderState.NoData);
    }
}
```

Plug it in via `dataLoader.type` on `GridOptions`. The same pattern applies to all other plugin types — implement the interface, inject `GRID_PLUGIN_INSTANCES` if you need cross-plugin signals, mark the component `OnPush`, and rely on `initialize(force)` being called *after* every other plugin has its options set.
