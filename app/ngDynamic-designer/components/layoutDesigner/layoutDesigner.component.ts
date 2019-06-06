import {Component, ChangeDetectionStrategy, ViewChildren, QueryList, Input, OnChanges, ChangeDetectorRef, SimpleChanges} from "@angular/core";
import {nameof} from "@asseco/common";

import {PackageLoader} from "../../packageLoader";
import {DesignerComponentRendererDirective} from "../../directives";
import {DesignerLayoutPlaceholderComponent, DesignerLayoutComponentRendererData, ɵDynamicComponentMetadata, DropEvent} from "../../interfaces";
import {COPY_ID} from "../designer.interface";
import {COMPONENT_PALETTE_ITEM} from "../componentPalette";
import {DragService} from "../../services";

/**
 * Component used for displaying layout designer
 */
@Component(
{
    selector: 'layout-designer',
    templateUrl: 'layoutDesigner.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDesignerComponent implements OnChanges
{
    //######################### public properties #########################

    /**
     * Root component for this page component tree
     */
    public get rootComponent(): DesignerLayoutPlaceholderComponent
    {
        if(!this.ɵChildren || !this.ɵChildren.first || !this.ɵChildren.first.component)
        {
            return null;
        }

        return this.ɵChildren.first.component;
    }

    //######################### public properties - template bindings #########################

    /**
     * Designer metadata for root component
     */
    public metadata: DesignerLayoutComponentRendererData;

    //######################### public properties - inputs #########################

    /**
     * Root component metadata stored in permanent store
     */
    @Input()
    public rootComponentMetadata: ɵDynamicComponentMetadata;

    /**
     * Packages that should be available in component palette
     */
    @Input()
    public packageNames: string[];

    //######################### public properties - getters/setters #########################

    /**
     * Indication whether metadatas are already set
     */
    public get isMetadata(): boolean
    {
        return !!this.metadata;
    }

    //######################### public properties - children #########################

    /**
     * Array of children renderers
     */
    @ViewChildren('layoutComponents')
    public ɵChildren: QueryList<DesignerComponentRendererDirective<DesignerLayoutPlaceholderComponent>>;

    //######################### constructor #########################
    constructor(private _packageLoader: PackageLoader,
                private _dragSvc: DragService,
                private _changeDetector: ChangeDetectorRef)
{
}

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public async ngOnChanges(changes: SimpleChanges)
    {
        if(nameof<LayoutDesignerComponent>('rootComponentMetadata') in changes && this.rootComponentMetadata)
        {
            if (!this.rootComponentMetadata.componentName ||
                !this.rootComponentMetadata.componentPackage)
            {
                return;
            }

            let designerMetadata = await this._packageLoader.getComponentsMetadata(this.rootComponentMetadata.componentPackage, this.rootComponentMetadata.componentName);

            this.rootComponentMetadata.ɵId = COPY_ID;

            this.metadata =
            {
                packageName: this.rootComponentMetadata.componentPackage,
                componentName: this.rootComponentMetadata.componentName,
                designerMetadata: designerMetadata,
                componentMetadata: this.rootComponentMetadata
            };

            this._changeDetector.detectChanges();
        }
    }

    /**
     * Called when new component is dropped into layout designer
     * @param dropEvent 
     */
    public async onDrop(dropEvent: DropEvent)
    {
        let dragItem = this._dragSvc.dragItem;
        let event = dropEvent.dragEvent;

        if (event)
        {
            event.preventDefault();
            event.stopPropagation();
        }

        let type = event.dataTransfer.getData('text/plain');

        if (type == COMPONENT_PALETTE_ITEM)
        {
            this.metadata = {
                packageName: dragItem.packageName,
                componentName: dragItem.componentName,
                designerMetadata: await this._packageLoader.getComponentsMetadata(dragItem.packageName, dragItem.componentName),
                componentMetadata: null
            }  
        }
    }
}