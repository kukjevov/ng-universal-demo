import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Optional, Inject, ElementRef} from "@angular/core";
import {BasicTableColumn, BodyContentRendererAbstractComponent, RowSelector, GRID_PLUGIN_INSTANCES, BODY_CONTENT_RENDERER_OPTIONS, GridPluginInstances, ROW_SELECTOR} from '@anglr/grid';
import {extend, isNumber} from "@jscrpt/common";

import {AdvancedDetailTableBodyContentRendererOptions, AdvancedDetailTableBodyContentRenderer} from './advancedDetailTableBodyContentRenderer.interface';
import {BasicDetailTableMetadata} from '../../../metadata/basicDetailTable.interface';

/**
 * Default options for 'AdvancedTableBodyContentRendererComponent'
 * @internal
 */
const defaultOptions: AdvancedDetailTableBodyContentRendererOptions =
{
    rowCssClass: () => null,
    rowClick: function(this: AdvancedDetailTableBodyContentRenderer, rowData: any, index: number)
    {
        this.toggleDetail(index);
    }
};

/**
 * Component used for rendering tbody for 'TableContentRenderer' advanced with detail
 */
@Component(
{
    selector: 'tbody.content-renderer-advanced-detail',
    templateUrl: 'advancedDetailTableBodyContentRenderer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedDetailTableBodyContentRendererComponent<TData = any> extends BodyContentRendererAbstractComponent<TData,
                                                                                                                       AdvancedDetailTableBodyContentRendererOptions<TData>,
                                                                                                                       BasicDetailTableMetadata<BasicTableColumn<TData>>>
                                                                          implements AdvancedDetailTableBodyContentRenderer<TData,
                                                                                                                            BasicDetailTableMetadata<BasicTableColumn<TData>>>
{
    //######################### protected fields #########################

    /**
     * Data that are rendered
     */
    protected _data: TData[];

    //######################### public properties - template bindings #########################

    /**
     * Currently used row selector
     * @internal
     */
    public rowSelector: RowSelector<any, any, TData>;

    /**
     * Array of indications which rows details are visible
     */
    public rowDetails: boolean[] = [];

    /**
     * Data that are rendered
     */
    public get data(): TData[]
    {
        return this._data;
    }
    public set data(value: TData[])
    {
        if(this._data != value)
        {
            this.rowDetails = [];
        }

        this._data = value;
    }

    //######################### constructor #########################
    constructor(pluginElement: ElementRef,
                changeDetector: ChangeDetectorRef,
                @Inject(GRID_PLUGIN_INSTANCES) @Optional() gridPlugins: GridPluginInstances,
                @Inject(BODY_CONTENT_RENDERER_OPTIONS) @Optional() options: AdvancedDetailTableBodyContentRendererOptions<TData>)
    {
        super(pluginElement, changeDetector, gridPlugins);

        defaultOptions.rowClick = defaultOptions.rowClick.bind(this);

        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of BodyContentRenderer #########################

    /**
     * Initialize plugin, to be ready to use
     */
    public initialize()
    {
        super.initialize();

        let rowSelector: RowSelector<any, any, TData> = this.gridPlugins[ROW_SELECTOR] as RowSelector<any, any, TData>;

        if(this.rowSelector && this.rowSelector != rowSelector)
        {
            this.rowSelector = null;
        }

        if(!this.rowSelector)
        {
            this.rowSelector = rowSelector;
        }
    }

    //######################### public methods - implementation of AdvancedDetailTableBodyContentRenderer #########################

    /**
     * Toggles visibility of detail for row
     * @param row - Row for which detail should be toggled, index or instance of row data
     * @param visible - If undefined or null, toggles visibility, otherwise switch visibility of detail according this value
     */
    public toggleDetail(row?: TData|number, visible?: boolean): void
    {
        if(!isNumber(row))
        {
            row = this._data.indexOf(row as TData);
        }

        this.rowDetails[row as number] = visible ?? !this.rowDetails[row as number];
    }
}