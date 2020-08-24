import {TemplateRef} from '@angular/core';
import {BasicTableMetadata, GridColumn, BasicTableColumnContext} from '@anglr/grid';

/**
 * Basic table metadata, contains columns and detail template
 */
export interface BasicDetailTableMetadata<TColumn extends GridColumn = any, TData = any> extends BasicTableMetadata<TColumn>
{
    /**
     * Template used for rendering detail
     */
    detailTemplate: TemplateRef<BasicTableColumnContext<TData>>;
}