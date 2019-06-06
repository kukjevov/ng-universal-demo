import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {DynamicComponentDesignerMetadata} from "../../../../ngDynamic-designer";
import {BlockComponentOptions} from "./block.interface";
import {placeholderModule, layoutMetadata, relationsMetadata} from "./designer";

/**
 * Layout component used for formatting block content
 */
@Component(
{
    selector: 'div[block-layout]',
    templateUrl: 'block.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:
    {
        '[style.paddingTop.px]': 'options?.padding?.top',
        '[style.paddingLeft.px]': 'options?.padding?.left',
        '[style.paddingRight.px]': 'options?.padding?.right',
        '[style.paddingBottom.px]': 'options?.padding?.bottom',
        '[style.marginTop.px]': 'options?.margin?.top',
        '[style.marginLeft.px]': 'options?.margin?.left',
        '[style.marginRight.px]': 'options?.margin?.right',
        '[style.marginBottom.px]': 'options?.margin?.bottom',
        '[style.fontSize.px]': 'options?.fontSize',
        '[style.backgroundColor]': 'options?.background'
    }
})
@DynamicComponentDesignerMetadata(
{
    placeholderModule,
    layoutMetadata,
    relationsMetadata
})
export class BlockComponent implements DynamicComponentGeneric<BlockComponentOptions>
{
    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: BlockComponentOptions;

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
        this._changeDetector.markForCheck();
    }
}