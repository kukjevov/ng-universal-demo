import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import * as handlebars from 'handlebars';

import {PlaceholderBaseComponent, PropertiesService} from "../../../../../../ngDynamic-designer";
import {DynamicComponentMetadataGeneric} from "../../../../../../ngDynamic-core";
import {TextBlockComponentOptions} from "../../textBlock.interface";
import {PackageLoader} from "../../../../../../ngDynamic-designer/packageLoader";

/**
 * Text block designer layout component used for designing components
 */
@Component(
{
    selector: 'div[text-block-designer]',
    templateUrl: 'textBlockDesigner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextBlockDesignerComponent extends PlaceholderBaseComponent<TextBlockComponentOptions>
{
    //######################### public properties - template bindings #########################

    /**
     * Html content that is displayed inside
     */
    public htmlContent: SafeHtml;

    //######################### public properties #########################

    /**
     * Layout metadata that will be used for rendering
     */
    public get metadata(): DynamicComponentMetadataGeneric<TextBlockComponentOptions>
    {
        return this._metadata;
    }

    //######################### constructor #########################
    constructor(changeDetector: ChangeDetectorRef,
                packageLoader: PackageLoader,
                optionsSvc: PropertiesService,
                private _sanitizer: DomSanitizer)
    {
        super(changeDetector, packageLoader, optionsSvc);
    }

    //######################### public methods #########################

    /**
     * Sets template to options
     * @param template Template to be set
     */
    public setTemplate(template?: string)
    {
        this._metadata.options.template = template;
    }

    /**
     * Gets existing template from options
     */
    public getTemplate()
    {
        if(this._metadata && this._metadata.options && this._metadata.options.template)
        {
            return this._metadata.options.template;
        }

        return '';
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        if(this._metadata && this._metadata.options && this._metadata.options.template)
        {
            this.htmlContent = this._sanitizer.bypassSecurityTrustHtml(handlebars.compile(this._metadata.options.template)({}));
        }

        super.invalidateVisuals();
    }
}