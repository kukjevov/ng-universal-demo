import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {ConditionalComponentOptions} from "./conditional.interface";
import {DynamicComponentDesignerMetadata} from "../../../../ngDynamic-designer";
import {placeholderModule, layoutMetadata, relationsMetadata} from "./designer";

/**
 * Conditional layout component used for conditionaly displaing component
 */
@Component(
{
    selector: 'conditional-layout-component',
    templateUrl: 'conditional.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@DynamicComponentDesignerMetadata(
{
    placeholderModule,
    layoutMetadata,
    relationsMetadata
})
export class ConditionalComponent implements DynamicComponentGeneric<ConditionalComponentOptions>
{
    //######################### public properties #########################

    /**
     * Condition used for determining whether display content of this component
     */
    public condition: boolean = false;

    /**
     * Options used for rendering this component
     */
    public options: ConditionalComponentOptions;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }
}