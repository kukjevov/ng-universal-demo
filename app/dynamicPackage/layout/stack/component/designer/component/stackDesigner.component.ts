import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {StackComponentOptions} from "../../stack.interface";
import {PropertiesService, DragService, DraggablePlaceholderComponent, ɵDynamicComponentMetadata} from "../../../../../../ngDynamic-designer";
import {DynamicComponentMetadataGeneric} from "../../../../../../ngDynamic-core";
import {PackageLoader} from "../../../../../../ngDynamic-designer/packageLoader";
import {COPY_ID} from "../../../../../../ngDynamic-designer/components/designer.interface";

/**
 * Stack designer layout component used for designing components
 */
@Component(
{
    selector: 'stack-layout-designer-component',
    templateUrl: 'stackDesigner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackDesignerComponent extends DraggablePlaceholderComponent<StackComponentOptions>
{
    //######################### public properties #########################

    /**
     * Layout metadata that will be used for rendering
     */
    public get metadata(): DynamicComponentMetadataGeneric<StackComponentOptions>
    {
        this._metadata.options = this.transformPropertiesToOptions();
        this._metadata.options.children = this.children.map(child => child.metadata);

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
            this._metadata.options.children)
        {
            for (let child of this._metadata.options.children)
            {
                await this.addChild(child);
            }
        }
    }

    /**
     * Method that is called when COPY_ID is detected and should be set for all content components
     */
    protected onCopyIdSet()
    {
        if(this._metadata &&
           this._metadata.options &&
           this._metadata.options.children &&
           this._metadata.options.children.length)
        {
            this._metadata.options.children.forEach((child: ɵDynamicComponentMetadata) =>
            {
                child.ɵId = COPY_ID;
            });
        }
    }
}