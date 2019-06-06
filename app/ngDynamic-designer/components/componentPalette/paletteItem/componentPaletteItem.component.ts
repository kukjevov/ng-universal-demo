import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

import {DesignerLayoutMetadata} from "../../../interfaces";
import {DesignerItemId} from "../../../interfaces";
import {DragService} from "../../../services";

export const COMPONENT_PALETTE_ITEM = "component_palette";

/**
 * Component used for displaying component palette in designer
 */
@Component(
{
    selector: 'component-palette-item',
    templateUrl: 'componentPaletteItem.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentPaletteItemComponent
{
    //######################### public properties - inputs #########################

    /**
     * List of available droplists
     */
    @Input()
    public droplistIds: string[];

    /**
     * Name of package that contains this component
     */
    @Input()
    public packageName: string;

    /**
     * Name of component to be rendered
     */
    @Input()
    public componentName: string;

    /**
     * Designer component metadata
     */
    @Input()
    public componentMetadata: DesignerLayoutMetadata

    /**
     * Component metadata
     */
    public get componentData(): DesignerItemId
    {
        return {
            packageName: this.packageName,
            componentName: this.componentName
        };
    }

    //######################### constructor #########################
    constructor(private _dragSvc: DragService)
    {
    }

    //######################### public methods #########################

    /**
     * Prepares component for drag event
     */
    public dragStart(event: DragEvent)
    {
        let targetElement: HTMLElement = <HTMLElement>event.target;
        if (targetElement)
        {
            targetElement.style.opacity = "0.4";
        }

        event.dataTransfer.setData('text/plain', COMPONENT_PALETTE_ITEM);

        this._dragSvc.dragStart(this.componentData)
    }

    /**
     * Stop drag event and restore element styles
     * @param event 
     */
    public dragEnd(event: DragEvent)
    {
        let targetElement: HTMLElement = <HTMLElement>event.target;
        if (targetElement)
        {
            targetElement.style.opacity = "1.0";
        }
        this._dragSvc.dragEnd();
    }
}