import {Component, ChangeDetectionStrategy, EventEmitter, Output, OnDestroy, ChangeDetectorRef, OnInit} from "@angular/core";

import {DesignerLayoutPlaceholderComponent, RelationsMetadata, DesignerMetadataClass} from "../../interfaces";
import {ɵRelationsMetadata} from "../nodeDesigner/nodeDesigner.interface";

/**
 * Name of transfer data for component drag
 */
export const COMPONENT_DRAG = 'component-drag';

/**
 * Name of transfer data for node drag
 */
export const NODE_DRAG = 'node-drag';

/**
 * Component used for displaying available nodes, components that can be added to node designer
 */
@Component(
{
    selector: 'node-component-palette',
    templateUrl: 'nodeComponentPalette.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['nodeComponentPalette.component.scss']
})
export class NodeComponentPaletteComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication whether this component was destroyed
     */
    private _destroyed: boolean = false;

    //######################### public properties - template bindings #########################

    /**
     * Array of node definitions for creating relations
     */
    public nodesDefinitions: ɵRelationsMetadata[] = [];

    /**
     * Array of components that are available for adding to node designer
     */
    public availableComponents: 
    {
        component: DesignerLayoutPlaceholderComponent;
        metadata: RelationsMetadata;
    }[] = [];

    //######################### public properties #########################

    /**
     * Array of used components in node designer
     */
    public usedComponents:
    {
        component: DesignerLayoutPlaceholderComponent;
        metadata: RelationsMetadata;
    }[] = [];

    //######################### public properties - outputs #########################

    /**
     * Occurs when user is dragging component from palette
     */
    @Output()
    public dragging: EventEmitter<boolean> = new EventEmitter<boolean>();

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public async ngOnInit()
    {
        let nodeDefinitions: {[name: string]: DesignerMetadataClass} = (await import(`../../../nodeDefinitions`)
            .catch(error =>
            {
                throw new Error(`Unable to load dynamic nodes package, missing @ngDynamic/nodeDefinitions, error '${error}'.`);
            })).nodeDefinitions as any;

        Object.keys(nodeDefinitions).forEach(key =>
        {
            let relationsMetadataClass = nodeDefinitions[key];

            if(relationsMetadataClass.ɵMetadata && relationsMetadataClass.ɵMetadata.relationsMetadata)
            {
                this.nodesDefinitions.push(relationsMetadataClass.ɵMetadata.relationsMetadata);
            }
        })

        this._changeDetector.detectChanges();
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._destroyed = true;
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles drag start for components
     * @param event Javascript drag event
     * @param id Id of component being dragged
     */
    public componentDragStart(event: DragEvent, id: string)
    {
        event.dataTransfer.setData('text/plain', COMPONENT_DRAG);
        event.dataTransfer.setData('text/id', id);
        this.dragging.emit(true);
    }

    /**
     * Handles drag start for node
     * @param event Javascript drag event
     * @param id Id of component being dragged
     */
    public nodeDragStart(event: DragEvent, name: string)
    {
        event.dataTransfer.setData('text/plain', NODE_DRAG);
        event.dataTransfer.setData('text/name', name);
        this.dragging.emit(true);
    }

    /**
     * Event handler used for handling drag end for component
     */
    public dragEnd()
    {
        this.dragging.emit(false);
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        if(!this._destroyed)
        {
            this._changeDetector.detectChanges();
        }
    }
}