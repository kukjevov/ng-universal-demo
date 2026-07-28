import {Directive, Signal, computed, effect, untracked} from '@angular/core';
import {DataLoader, RowSelector, DataResponse, GridPluginType, BasicRowSelectorComponent, BasicRowSelectorOptions} from '@anglr/grid';
import {isSelectedAny, resetSelection, selectAllOnPage, getSelectedData, areSelectedAllOnPage, invalidateContent} from '@anglr/grid/extensions';
import {deserializeFromUrlQuery, serializeToUrlQuery} from '@jscrpt/common';

import {BaseSignalsPrehladComponent} from './baseSignalsPrehladComponent';

/**
 * Base class for all "prehlad" pages with selection of rows
 */
@Directive()
export abstract class BaseSignalsPrehladWithSelectionComponent<TFilter extends Record<string, any>, TDataItem, TSelectedData, TId> extends BaseSignalsPrehladComponent<TFilter, TDataItem>
{
    //######################### protected properties - template bindings #########################

    /**
     * Indication whether are all selected
     */
    protected selectedAll: Signal<boolean> = computed(() =>
    {
        this.grid().getPlugin<DataLoader<DataResponse>>(GridPluginType.DataLoader).result();

        return this.grid().executeAndReturn(areSelectedAllOnPage(this.selectedAllPredicate)) ?? false;
    });

    /**
     * Indication whether is any item selected
     */
    protected selectedAny: Signal<boolean> = computed(() => this.grid().executeAndReturn(isSelectedAny()) ?? false);

    //######################### constructor #########################
    constructor()
    {
        super();

        this.gridOptions =
        {
            plugins:
            {
                rowSelector:
                {
                    type: BasicRowSelectorComponent,
                    options: <BasicRowSelectorOptions<TSelectedData, TDataItem, TId>>
                    {
                        getRowData: this.getRowData,
                        getRowId: this.getRowId,
                    },
                },
            },
        };

        const selectedRouteParamEncoded = computed(() => this.routeParams().selected as string|undefined|null);
        const selectedData = computed(() =>
        {
            const selected = selectedRouteParamEncoded();

            return (selected ? deserializeFromUrlQuery(selected) : []) as TSelectedData[];
        });

        effect(() =>
        {
            if(!this.gridInitialized())
            {
                return;
            }

            const rowSelector = this.grid().getPlugin<RowSelector<TSelectedData, TDataItem, TId>>(GridPluginType.RowSelector);

            if(!rowSelector)
            {
                throw new Error('BaseSignalsPrehladWithSelectionComponent: missing row selector');
            }

            for(const item of selectedData())
            {
                rowSelector.selectItem(item as unknown as TDataItem);
            }
        });

        effect(() =>
        {
            if(!this.gridInitialized())
            {
                return;
            }

            const selected = this.getSelectedData();
            const filter = this.route.snapshot.params.filter;

            this.router.navigate(['.', {selected: serializeToUrlQuery(selected), ...filter ? {filter} : {}}],
                                 {
                                     relativeTo: this.route,
                                     queryParamsHandling: 'merge',
                                     replaceUrl: true,
                                 });
        });
    }

    //######################### protected methods - template bindings #########################

    /**
     * Applies limit of row selection
     * @param itm - Data item for row
     * @param event - Mouse event that occured
     */
    protected applyLimit(itm: TDataItem, event: MouseEvent): void
    {
        untracked(() =>
        {
            const rowSelector = this.grid().getPlugin<RowSelector<TSelectedData, TDataItem, TId>>(GridPluginType.RowSelector);

            if(!rowSelector)
            {
                throw new Error('BasePrehladWithSelectionComponent: missing row selector');
            }

            if(!rowSelector.isSelected(itm) && (event.target as HTMLInputElement).checked)
            {
                event.preventDefault();
            }
        });
    }

    /**
     * Toggles all selected rows
     * @param {boolean} value Indication whether select all rows or deselect all
     */
    protected toggleAllSelected(value: boolean): void
    {
        this.grid().execute(selectAllOnPage(value, this.selectedAllPredicate),
                            invalidateContent());
    }

    /**
     * Resets selection in grid
     */
    protected resetSelected(): void
    {
        this.grid().execute(resetSelection());
    }

    //######################### protected methods #########################

    /**
     * Predicate that is used when selecting/deselecting all or testing
     */
    protected selectedAllPredicate(_item: TDataItem): boolean
    {
        return true;
    }

    /**
     * Gets currently selected data
     */
    protected getSelectedData(): TSelectedData[]
    {
        return this.grid().executeAndReturn(getSelectedData<TSelectedData>()) ?? [];
    }

    /**
     * Gets id for row
     * @param data - Data of row
     */
    protected abstract getRowId(data: TDataItem): TId;

    /**
     * Gets selected data for row
     * @param data - Data of row
     */
    protected getRowData(data: TDataItem): TSelectedData
    {
        return data as unknown as TSelectedData;
    }
}
