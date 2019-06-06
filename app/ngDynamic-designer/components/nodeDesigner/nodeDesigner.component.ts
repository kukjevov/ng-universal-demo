import {Component, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnInit, Injector, OnDestroy} from "@angular/core";
import {generateId} from "@asseco/common";
import {select, Selection, event, zoom, zoomTransform} from 'd3';
import {Subscription, Subject, Observable} from "rxjs";

import {SvgNode, SvgRelation} from "./misc";
import {SvgPeerDropArea, Coordinates, DesignerLayoutPlaceholderComponent, RelationsMetadata, SvgNodeDynamicNode} from "../../interfaces";
import {DynamicComponentRelationMetadata} from "../../../ngDynamic-core";
import {NodeDesignerNodeState, ɵRelationsMetadata} from "./nodeDesigner.interface";

/**
 * Component used for designing relation nodes
 */
@Component(
{
    selector: 'node-designer',
    template: '',
    styles:
    [
        `:host
        {
            display: block;
            height: 100%;
            overflow: hidden;
        }`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDesignerComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subject used for noticing parent about destroying of node component
     */
    private _destroyingComponentNodeSubject: Subject<DesignerLayoutPlaceholderComponent> = new Subject<DesignerLayoutPlaceholderComponent>();

    /**
     * All top svg objects
     */
    private _svgData:
    {
        svg?: Selection<SVGSVGElement, {}, null, undefined>,
        parentGroup?: Selection<SVGGElement, {}, null, undefined>,
        relationsGroup?: Selection<SVGGElement, {}, null, undefined>
    } = {};

    /**
     * Array of added nodes into node designer
     */
    private _addedNodes:
    {
        component?: DesignerLayoutPlaceholderComponent;
        svgNode: SvgNodeDynamicNode;
        svgNodeDestroyingSubscription: Subscription;
    }[] = [];

    /**
     * Information about active drop area
     */
    private _activeDropArea: SvgPeerDropArea = null;

    /**
     * Getter for activeDropArea
     */
    private _getDropAreaFn = () => this._activeDropArea;

    /**
     * Setter for activeDropArea
     */
    private _setDropAreaFn = (dropArea: SvgPeerDropArea) => this._activeDropArea = dropArea;

    /**
     * Gets metadata for rendering from current state of node designer
     */
    public get metadata(): Promise<DynamicComponentRelationMetadata[]>
    {
        return this._getMetadata();        
    }

    /**
     * Metadata for node designer, allows you to reconstruct current state
     */
    public get designerMetadata(): NodeDesignerNodeState[]
    {
        return this._addedNodes.map(itm =>
        {
            return <NodeDesignerNodeState>{
                id: itm.svgNode.id,
                componentNode: !!itm.component,
                position: itm.svgNode.position,
                additionalData: itm.svgNode.additionalData
            };
        });
    }

    /**
     * Occurs when node component is being destryed
     */
    public get destroyingComponentNode(): Observable<DesignerLayoutPlaceholderComponent>
    {
        return this._destroyingComponentNodeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef,
                private _element: ElementRef<HTMLElement>,
                private _injector: Injector)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        //creates scale and drag behavior
        let $zoom = zoom()
            .scaleExtent([1/4, 2])
            .on("zoom", () =>
        {
            if(this._svgData.parentGroup)
            {
                this._svgData.parentGroup.attr("transform", event.transform);
            }
        });

        //creates svg element
        let selfObj = select(this._element.nativeElement),
            svgWidth = '100%',
            svgHeight = '100%';
        this._svgData.svg = selfObj.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .attr("style", "background-color: #1e1e1e;")
            .call($zoom);

        //creates groups that are used for rendering contents
        this._svgData.parentGroup = this._svgData.svg.append("g");
        this._svgData.relationsGroup = this._svgData.parentGroup.append("g");
        this._createDefs();
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._addedNodes.forEach(node =>
        {
            if(node.component)
            {
                this._destroyingComponentNodeSubject.next(node.component);
            }

            node.component = null;
            node.svgNodeDestroyingSubscription.unsubscribe();
            node.svgNodeDestroyingSubscription = null;
            node.svgNode.destroy();
        });

        this._addedNodes = [];
        this._svgData.relationsGroup.remove();
        this._svgData.relationsGroup = null;
        this._svgData.parentGroup.remove();
        this._svgData.parentGroup = null;
        this._svgData.svg.remove();
        this._svgData.svg = null
        this._svgData = {};
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    /**
     * Adds component into node designer
     * @param coordinates Coordinates of newly added node
     * @param component Component to be added
     * @param metadata Metadata for component that is added
     * @param nodeOptions Stored node options
     */
    public addComponent(coordinates: Coordinates, component: DesignerLayoutPlaceholderComponent, metadata: RelationsMetadata, nodeOptions?: any): SvgNodeDynamicNode
    {
        let currentZoom = zoomTransform(this._svgData.svg.node());

        let svgNodeInfo =
        {
            svgNodeDestroyingSubscription: null,
            component: component,
            svgNode: metadata.customNode ? new metadata.customNode(this._svgData.parentGroup,
                                                                   <ɵRelationsMetadata>
                                                                   {
                                                                       id: component.id,
                                                                       description: metadata.description,
                                                                       name: metadata.name,
                                                                       x: currentZoom.invertX(coordinates.x),
                                                                       y: currentZoom.invertY(coordinates.y),
                                                                       inputs: JSON.parse(JSON.stringify(metadata.inputs || [])),
                                                                       outputs: JSON.parse(JSON.stringify(metadata.outputs || [])),
                                                                       dynamicInputs: metadata.dynamicInputs,
                                                                       normalizeOptions: metadata.normalizeOptions,
                                                                       nodeOptionsMetadata: metadata.nodeOptionsMetadata,
                                                                       nodeType: null
                                                                   },
                                                                   this._setDropAreaFn,
                                                                   () => new SvgRelation(this._svgData.relationsGroup, null, null, this._getDropAreaFn),
                                                                   this._injector,
                                                                   component,
                                                                   nodeOptions || {}) :
                                           new SvgNode(this._svgData.parentGroup,
                                                       {
                                                           id: component.id,
                                                           description: metadata.description,
                                                           name: metadata.name,
                                                           x: currentZoom.invertX(coordinates.x),
                                                           y: currentZoom.invertY(coordinates.y),
                                                           inputs: JSON.parse(JSON.stringify(metadata.inputs || [])),
                                                           outputs: JSON.parse(JSON.stringify(metadata.outputs || [])),
                                                           dynamicInputs: metadata.dynamicInputs,
                                                           normalizeOptions: metadata.normalizeOptions,
                                                           nodeOptionsMetadata: metadata.nodeOptionsMetadata,
                                                           nodeType: null
                                                       },
                                                       this._setDropAreaFn,
                                                       () => new SvgRelation(this._svgData.relationsGroup, null, null, this._getDropAreaFn),
                                                       this._injector,
                                                       component,
                                                       nodeOptions || {})
        };

        svgNodeInfo.svgNodeDestroyingSubscription = svgNodeInfo.svgNode.destroying.subscribe(this._handleDestroySvgNode);

        this._addedNodes.push(svgNodeInfo);

        return svgNodeInfo.svgNode;
    }

    /**
     * Adds node into node designer
     * @param coordinates Coordinates of newly added node
     * @param metadata Metadata for node to be added
     * @param nodeOptions Stored node options
     */
    public addNode(coordinates: Coordinates, metadata: RelationsMetadata, nodeOptions?: any): SvgNodeDynamicNode
    {
        let currentZoom = zoomTransform(this._svgData.svg.node());
        let ɵMetadata: ɵRelationsMetadata = metadata;

        let svgNodeInfo =
        {
            svgNodeDestroyingSubscription: null,
            svgNode: metadata.customNode ? new metadata.customNode(this._svgData.parentGroup,
                                                                   <ɵRelationsMetadata>
                                                                   {
                                                                       id: generateId(12),
                                                                       description: metadata.description,
                                                                       name: metadata.name,
                                                                       x: currentZoom.invertX(coordinates.x),
                                                                       y: currentZoom.invertY(coordinates.y),
                                                                       inputs: JSON.parse(JSON.stringify(metadata.inputs || [])),
                                                                       outputs: JSON.parse(JSON.stringify(metadata.outputs || [])),
                                                                       dynamicInputs: metadata.dynamicInputs,
                                                                       normalizeOptions: metadata.normalizeOptions,
                                                                       nodeOptionsMetadata: metadata.nodeOptionsMetadata,
                                                                       nodeType: ɵMetadata.nodeType
                                                                   },
                                                                   this._setDropAreaFn,
                                                                   () => new SvgRelation(this._svgData.relationsGroup, null, null, this._getDropAreaFn),
                                                                   this._injector,
                                                                   null,
                                                                   nodeOptions || {}) :
                                           new SvgNode(this._svgData.parentGroup,
                                                       {
                                                           id: generateId(12),
                                                           description: metadata.description,
                                                           name: metadata.name,
                                                           x: currentZoom.invertX(coordinates.x),
                                                           y: currentZoom.invertY(coordinates.y),
                                                           inputs: JSON.parse(JSON.stringify(metadata.inputs || [])),
                                                           outputs: JSON.parse(JSON.stringify(metadata.outputs || [])),
                                                           dynamicInputs: metadata.dynamicInputs,
                                                           normalizeOptions: metadata.normalizeOptions,
                                                           nodeOptionsMetadata: metadata.nodeOptionsMetadata,
                                                           nodeType: ɵMetadata.nodeType
                                                       },
                                                       this._setDropAreaFn,
                                                       () => new SvgRelation(this._svgData.relationsGroup, null, null, this._getDropAreaFn),
                                                       this._injector,
                                                       null,
                                                       nodeOptions || {})
        };
        
        svgNodeInfo.svgNodeDestroyingSubscription = svgNodeInfo.svgNode.destroying.subscribe(this._handleDestroySvgNode);

        this._addedNodes.push(svgNodeInfo);

        return svgNodeInfo.svgNode;
    }

    //######################### private methods #########################

    /**
     * Handles destroying of svg node
     * @param svgNode Instance of svg node to be destroyed
     */
    private _handleDestroySvgNode = (svgNode: SvgNodeDynamicNode) =>
    {
        let found = this._addedNodes.find(itm => itm.svgNode == svgNode);

        if(found)
        {
            if(found.component)
            {
                this._destroyingComponentNodeSubject.next(found.component);
            }

            let index = this._addedNodes.indexOf(found);
            this._addedNodes.splice(index, 1);
            found.component = null;
            found.svgNodeDestroyingSubscription.unsubscribe();
            found.svgNodeDestroyingSubscription = null;
            found.svgNode = null;
        }
    };

    /**
     * Creates reusable definitions
     */
    private _createDefs()
    {
        let inputGradient = this._svgData.svg.append("defs")
            .append("radialGradient")
                .attr("id", "input-hover");

        inputGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#569cd6");

        inputGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "transparent");

        let outputGradient = this._svgData.svg.append("defs")
            .append("radialGradient")
                .attr("id", "output-hover");

        outputGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#e99d2c");

        outputGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "transparent");
    }

    /**
     * Gets metadata for all nodes
     */
    private async _getMetadata(): Promise<DynamicComponentRelationMetadata[]>
    {
        let result: DynamicComponentRelationMetadata[] = [];

        for(let node of this._addedNodes)
        {
            result.push(await node.svgNode.metadata);
        }
        
        return result;
    }
}