import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";

/**
 * Component used for displaying properties of objects
 */
@Component(
{
    selector: 'text-block-component',
    templateUrl: 'textBlock.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextBlockComponent implements DynamicComponentGeneric<string>
{
    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: string;

    /**
     * Object storing property to be displayed
     */
    public data: any = {};

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