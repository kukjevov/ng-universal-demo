import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {GridComponentOptions} from "./grid.interface";

/**
 * Css grid layout component used for rendering components
 */
@Component(
{
    selector: 'grid-layout-component',
    templateUrl: 'grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements DynamicComponentGeneric<GridComponentOptions>
{
    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: GridComponentOptions;

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