import {ExistingProvider, Component, ChangeDetectionStrategy, EventEmitter, forwardRef, ContentChildren, QueryList, AfterContentInit, TemplateRef, ContentChild} from "@angular/core";
import {METADATA_GATHERER, MetadataGatherer, BasicTableColumn, BasicTableColumnComponent, BasicTableColumnContext} from '@anglr/grid';
import {BasicDetailTableMetadata} from './basicDetailTable.interface';

/**
 * Component that is used for gathering metadata for basic detail table
 */
@Component(
{
    selector: 'basic-detail-table-metadata',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <ExistingProvider>
        {
            provide: METADATA_GATHERER,
            useExisting: forwardRef(() => BasicDetailTableMetadataGathererComponent)
        }
    ]
})
export class BasicDetailTableMetadataGathererComponent<TData = any> implements AfterContentInit, MetadataGatherer<BasicDetailTableMetadata<BasicTableColumn<TData>>>
{
    //######################### public properties - implementation of MetadataGatherer<BasicTableColumn[]> #########################

    /**
     * Information that metadata for grid has changed
     */
    public metadataChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - children #########################

    /**
     * Gets all columns defined in gatherer
     * @internal
     */
    @ContentChildren(BasicTableColumnComponent)
    public columns: QueryList<BasicTableColumnComponent<TData>>;

    /**
     * Gets template for rendering detail
     * @internal
     */
    @ContentChild('detail')
    public detailTemplate: TemplateRef<BasicTableColumnContext<TData>>;

    //######################### public methods - implementation of MetadataGatherer<BasicTableColumn[]> #########################

    /**
     * Gets current metadata for grid
     */
    public getMetadata(): BasicDetailTableMetadata<BasicTableColumn<TData>>
    {
        return {
            columns: this.columns.toArray(),
            detailTemplate: this.detailTemplate
        };
    }

    //######################### public methods - implementation of AfterContentInit #########################

    /**
     * Called when content was initialized
     */
    public ngAfterContentInit()
    {
        this.columns.changes.subscribe(() =>
        {
            this.metadataChange.emit();
        });
    }
}