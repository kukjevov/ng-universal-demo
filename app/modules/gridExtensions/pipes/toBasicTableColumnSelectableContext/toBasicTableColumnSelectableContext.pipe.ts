import {Pipe, PipeTransform} from '@angular/core';
import {BasicTableColumnSelectableContext, BasicTableColumn, RowSelector} from '@anglr/grid';

/**
 * Pipe that is used for creating BasicTableColumnSelectableContext
 */
@Pipe({name: 'toBasicTableColumnSelectableContext'})
export class ToBasicTableColumnSelectableContextPipe<TData = any> implements PipeTransform
{
    /**
     * Creates instance of BasicTableColumnSelectableContext
     * @param data - Row data
     * @param column - Instance of column definition
     * @param index - Index of rendered row in current page
     * @param startingIndex - Starting index of currently displayed items
     * @param rowSelector - Instance of row selector plugin
     */
    public transform(data: TData, column: BasicTableColumn<TData>, index: number, startingIndex: number, rowSelector: RowSelector<any, any, TData>): BasicTableColumnSelectableContext<TData>
    {
        return new BasicTableColumnSelectableContext(data, column, index, startingIndex, rowSelector);
    }
}