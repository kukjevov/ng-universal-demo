import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {PropertiesService, DraggablePlaceholderComponent, DragService, ɵDynamicComponentMetadata} from "../../../../../../ngDynamic-designer";
import {DynamicComponentMetadataGeneric, DynamicComponentMetadata} from "../../../../../../ngDynamic-core";
import {BlockComponentOptions} from "../../block.interface";
import {PackageLoader} from "../../../../../../ngDynamic-designer/packageLoader";
import {COPY_ID} from "../../../../../../ngDynamic-designer/components/designer.interface";

/**
 * Block designer layout component used for designing components
 */
@Component(
{
    selector: 'div[block-layout-designer]',
    templateUrl: 'blockDesigner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockDesignerComponent extends DraggablePlaceholderComponent<BlockComponentOptions>
{
    //######################### public properties #########################

    /**
     * Layout metadata that will be used for rendering
     */
    public get metadata(): DynamicComponentMetadataGeneric<BlockComponentOptions>
    {
        let contentMetadata: DynamicComponentMetadata;
        let content = this.children[0];

        if(content)
        {
            contentMetadata = content.metadata;
        }

        this._metadata.options = this.transformPropertiesToOptions();
        this._metadata.options.content = contentMetadata;

        return this._metadata;
    }

    //######################### constructor #########################
    constructor(changeDetector: ChangeDetectorRef,
                packageLoader: PackageLoader,
                optionsSvc: PropertiesService,
                dragSvc: DragService)
    {
        super(changeDetector, packageLoader, optionsSvc, dragSvc);

        this._isContainer = true;
    }

    //######################### protected methods #########################

    /**
     * Callback after metadata was set
     */
    protected async afterMetadataSet(): Promise<void>
    {
        if (this._metadata &&
            this._metadata.options &&
            this._metadata.options.content)
        {
            await this.addChild(this._metadata.options.content);
        }
    }

    /**
     * Method that is called when COPY_ID is detected and should be set for all content components
     */
    protected onCopyIdSet()
    {
        if(this._metadata &&
           this._metadata.options &&
           this._metadata.options.content)
        {
            (this._metadata.options.content as ɵDynamicComponentMetadata).ɵId = COPY_ID;
        }
    }
}