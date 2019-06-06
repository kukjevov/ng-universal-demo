import {Injectable, ChangeDetectorRef} from "@angular/core";

import {PlaceholderBaseComponent} from "../placeholderBase/placeholderBase.component";
import {PackageLoader} from "../../packageLoader";
import {PropertiesService, DragService} from "../../services";
import {COMPONENT_PALETTE_ITEM} from "../componentPalette";
import {DropEvent, DropArea} from "../../interfaces";

export const COMPONENT_ITEM = "component";

/**
 * Base class for all draggable placeholder components
 */
@Injectable()
export abstract class DraggablePlaceholderComponent<TOptions> extends PlaceholderBaseComponent<TOptions>
{
    //######################### constructor #########################
    constructor(protected _changeDetector: ChangeDetectorRef,
        protected _packageLoader: PackageLoader,
        protected _optionsSvc: PropertiesService,
        protected _dragSvc: DragService)
    {
        super(_changeDetector, _packageLoader, _optionsSvc)
    }
    
    /**
     * Handles drop event and places new component on defined position
     * @param event drag event
     */
    public async onDrop(dropEvent: DropEvent, index?: number)
    {
        let dragItem = this._dragSvc.dragItem;
        let event = dropEvent.dragEvent;

        if (event)
        {
            event.preventDefault();
            event.stopPropagation();
        }

        let type = event.dataTransfer.getData('text/plain');

        if (dropEvent.dropArea == DropArea.BOTTOM || 
            dropEvent.dropArea == DropArea.RIGHT)
        {
            index++;
        }

        if (type == COMPONENT_PALETTE_ITEM)
        {
            this.addChildMetadata(
                {
                    packageName: dragItem.packageName,
                    componentName: dragItem.componentName,
                    designerMetadata: await this._packageLoader.getComponentsMetadata(dragItem.packageName, dragItem.componentName),
                    componentMetadata: null
                },
                index
            );  
        }
        else if (type == COMPONENT_ITEM)
        {
            //TODO not yet implemented!
        }
    }
}