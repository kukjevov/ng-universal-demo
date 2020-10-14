import {TemplateRef, Type} from '@angular/core';

/**
 * Represents component that is used for rendering tooltip
 */
export interface TooltipRenderer<TData = any>
{
    //######################### properties #########################

    /**
     * Data that are rendered in tooltip
     */
    data: TData|null;

    /**
     * Template used for rendering tooltip
     */
    template: TemplateRef<TData>|null;

    /**
     * Indication whether are html tags allowed in tooltip text
     */
    allowHtml: boolean;

    //######################### methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}

/**
 * Options used for tooltip directive
 */
export interface TooltipOptions
{
    /**
     * Delay for displaying of tooltip on hover
     */
    delay?: number;

    /**
     * Type of tooltip renderer that is used for rendering tooltip
     */
    tooltipRenderer?: Type<TooltipRenderer>;
}