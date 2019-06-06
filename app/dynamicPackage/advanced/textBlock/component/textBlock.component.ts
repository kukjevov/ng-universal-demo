import {Component, ChangeDetectionStrategy, ElementRef} from "@angular/core";
import * as handlebars from 'handlebars';

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {TextBlockComponentOptions} from "./textBlock.interface";
import {DynamicComponentDesignerMetadata} from "../../../../ngDynamic-designer";
import {placeholderModule, layoutMetadata, relationsMetadata} from "./designer";

/**
 * Component used for displaying handlebars template and rendering objects
 */
@Component(
{
    selector: 'div[text-block-handlebars]',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@DynamicComponentDesignerMetadata(
{
    placeholderModule,
    layoutMetadata,
    relationsMetadata
})
export class TextBlockComponent implements DynamicComponentGeneric<TextBlockComponentOptions>
{
    //######################### private fields #########################

    /**
     * Delegate used for creating html template filled with data
     */
    private _templateRendererDelegate: Handlebars.TemplateDelegate<any>;

    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: TextBlockComponentOptions;

    /**
     * Object that will be displayed in template
     */
    public data: any = {};

    //######################### constructor #########################
    constructor(private _element: ElementRef<HTMLDivElement>)
    {
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        if(!this._templateRendererDelegate)
        {
            this._templateRendererDelegate = handlebars.compile(this.options.template);
        }

        if(this.data)
        {
            this._element.nativeElement.innerHTML = this._templateRendererDelegate(this.data);
        }
    }
}