import {Component, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef} from '@angular/core';

import {TooltipRenderer} from '../../misc/tooltip.interface';

/**
 * Component used for displaying tooltip content
 */
@Component(
{
    selector: 'tooltip-popup',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent<TData = any> implements TooltipRenderer<TData>
{
    //######################### public properties - implementation of TooltipRenderer #########################

    /**
     * Data that are rendered in tooltip
     */
    public data: TData|null;

    /**
     * Template used for rendering tooltip
     */
    public template: TemplateRef<TData>|null;

    /**
     * Indication whether are html tags allowed in tooltip text
     */
    public allowHtml: boolean;

    //######################### constructor #########################
    constructor(protected _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of TooltipRenderer #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }
}