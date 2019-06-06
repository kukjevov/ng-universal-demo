import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {PlaceholderBaseComponent, PropertiesService} from "../../../../../../ngDynamic-designer";
import {DynamicComponentMetadataGeneric} from "../../../../../../ngDynamic-core";
import {PackageLoader} from "../../../../../../ngDynamic-designer/packageLoader";
import {ConditionalComponentOptions} from "../../conditional.interface";

/**
 * Conditional designer layout component used for conditionaly displaing component
 */
@Component(
{
    selector: 'conditional-layout-designer-component',
    templateUrl: 'conditionalDesigner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionalDesignerComponent extends PlaceholderBaseComponent<ConditionalComponentOptions>
{
    //######################### public properties #########################

    /**
     * Layout metadata that will be used for rendering
     */
    public get metadata(): DynamicComponentMetadataGeneric<ConditionalComponentOptions>
    {
        this._metadata.options = this.transformPropertiesToOptions();
        this._metadata.options.content = this.children && this.children.length && this.children[0].metadata;

        return this._metadata;
    }

    //######################### constructor #########################
    constructor(changeDetector: ChangeDetectorRef,
                packageLoader: PackageLoader,
                optionsSvc: PropertiesService)
    {
        super(changeDetector, packageLoader, optionsSvc);

        this._isContainer = true;
    }

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
}