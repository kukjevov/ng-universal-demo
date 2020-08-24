import {AdvancedTableBodyContentRendererOptions, AdvancedTableBodyContentRenderer} from '@anglr/grid';

/**
 * Options for advanced detail table body content renderer
 */
export interface AdvancedDetailTableBodyContentRendererOptions<TData = any> extends AdvancedTableBodyContentRendererOptions<TData>
{
}

/**
 * Public API for AdvancedDetailTableBodyContentRenderer
 */
export interface AdvancedDetailTableBodyContentRenderer<TData = any, TMetadata = any> extends AdvancedTableBodyContentRenderer<TData, TMetadata>
{
    /**
     * Toggles visibility of detail for row
     * @param row - Row for which detail should be toggled, index or instance of row data
     * @param visible - If undefined or null, toggles visibility, otherwise switch visibility of detail according this value
     */
    toggleDetail(row?: TData|number, visible?: boolean): void;
}