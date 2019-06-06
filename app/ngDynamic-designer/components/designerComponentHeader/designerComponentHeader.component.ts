import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

import {LayoutMetadata} from "../../interfaces";

/**
 * Component that is used for displaying design components
 */
@Component(
    {
        selector: 'designer-component-header',
        templateUrl: 'designerComponentHeader.component.html',
        changeDetection: ChangeDetectionStrategy.OnPush
    }
)
export class DesignerComponentHeaderComponent
{
    //######################### public properties - inputs #########################

    /**
     * Designer component metadata
     */
    @Input('layoutMetadata')
    public data: LayoutMetadata;

    /**
     * Trigger event for component removal
     * @param event 
     */
    public remove(event: MouseEvent)
    {
        if (event)
        {
            event.preventDefault();
            event.stopPropagation();
        }

        console.log('NOT YET IMPLEMENTED!');
    }
}