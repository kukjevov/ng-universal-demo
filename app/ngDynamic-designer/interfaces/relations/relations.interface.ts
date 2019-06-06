import {Injector} from '@angular/core';
import {Selection, BaseType} from 'd3';
import {Observable, Subscription} from "rxjs";

import {DesignerCommonMetadata, DesignerLayoutPlaceholderComponent} from "../metadata.interface";
import {DynamicNode, DynamicComponentRelationMetadata} from "../../../ngDynamic-core";
import {PropertiesPropertyMetadata} from "../properties/properties.interface";

/**
 * Metadata used for node relations designer
 */
export interface RelationsMetadata extends DesignerCommonMetadata
{
    /**
     * Array of inputs definitions
     */
    inputs?: RelationsInputOutputMetadata[];

    /**
     * Array of output definitions
     */
    outputs?: RelationsInputOutputMetadata[];

    /**
     * Method that converts node options into inputs
     */
    dynamicInputs?: (nodeOptions: any) => RelationsInputOutputMetadata[];

    /**
     * Normalize node options before saving
     */
    normalizeOptions?: (nodeOptions: any) => any;

    /**
     * Node options metadata used for creating nodeOptions
     */
    nodeOptionsMetadata?: PropertiesPropertyMetadata[];

    /**
     * Type used for creating custom node with specific functionality
     */
    customNode?: SvgNodeDynamicNodeConstructor;
}

/**
 * Metadata used for node relations designer generic
 */
export interface RelationsMetadataGeneric<TNodeOptions> extends RelationsMetadata
{
    /**
     * Method that converts node options into inputs
     */
    dynamicInputs: (nodeOptions: TNodeOptions) => RelationsInputOutputMetadata[];

    /**
     * Normalize node options before saving
     */
    normalizeOptions?: (nodeOptions: TNodeOptions) => TNodeOptions;
}

/**
 * Definition of input or output relation metadata
 */
export interface RelationsInputOutputMetadata
{
    /**
     * Id of input or output used in metadata for identification
     */
    id?: string;

    /**
     * Displayed name of input or output in node designer
     */
    name?: string;

    /**
     * Displayed data type of input or output in node designer
     */
    type?: string;
}

/**
 * Base for dynamic nodes in nodes designer
 */
export interface SvgDynamicNode extends DynamicNode
{
    /**
     * Method used for destroying this relation node
     */
    destroy(): void;
}

/**
 * Definition of class for SvgNode
 */
export interface SvgNodeDynamicNodeConstructor
{
    new (parentGroup: Selection<BaseType, {}, null, undefined>,
         metadata: RelationsMetadata,
         validDropToggle: (dropArea: SvgPeerDropArea) => void,
         createRelation: () => SvgRelationDynamicNode,
         injector: Injector,
         layoutComponent: DesignerLayoutPlaceholderComponent,
         nodeOptions: any): SvgNodeDynamicNode;
}

/**
 * Represents svg node 
 */
export interface SvgNodeDynamicNode extends SvgDynamicNode
{
    /**
     * Unique id of node which is connected to other nodes
     */
    readonly id: string;

    /**
     * Gets X and Y coordinates of node
     */
    readonly position: Coordinates;

    /**
     * Gets metadata of current node
     */
    readonly metadata: Promise<DynamicComponentRelationMetadata>;

    /**
     * Occurs when this node is being destroyed
     */
    readonly destroying: Observable<SvgNodeDynamicNode>;

    /**
     * Additional data that needs to be stored for node
     */
    additionalData?: any;

    /**
     * Gets input coordinates of specified input
     * @param inputName Name of input which coordinates will be get
     * @param dynamic Indication whether is input dynamic
     */
    getInputCoordinates(inputName: string, dynamic: boolean): Coordinates;

    /**
     * Gets output coordinates of specified output
     * @param outputName Name of output which coordinates will be get
     */
    getOutputCoordinates(outputName: string): Coordinates;

    /**
     * Adds relation to specified output
     * @param outputName Output name which will register relation
     * @returns Returns relation that will start from this output
     */
    addOutputRelation(outputName: string): SvgRelationDynamicNode;

    /**
     * Adds relation to specified input
     * @param relation Relation to be added to specified input
     * @param inputName Input name which will register relation
     * @param dynamic Indication whether is input dynamic
     */
    addInputRelation(relation: SvgRelationDynamicNode, inputName: string, dynamic: boolean): boolean;

    /**
     * Gets real dynamic input id 
     * @param inputName Name of input which id will be get
     */
    getDynamicInputId(inputName: string): string;

    /**
     * Updates all relations position when dragging
     */
    updateRelations(): void;
}

/**
 * Represents svg relations between two nodes
 */
export interface SvgRelationDynamicNode extends SvgDynamicNode
{
    /**
     * Occurs when this relations is being destroyed
     */
    readonly destroying: Observable<SvgRelationDynamicNode>;

    /**
     * Start coordinate of relation path
     */
    start: Coordinates;

    /**
     * End coordinate of relation path
     */
    end: Coordinates;

    /**
     * Subscription for start destroying of this relation
     */
    startDestroyingSubscription: Subscription;

    /**
     * Subscription for end destroying of this relation
     */
    endDestroyingSubscription: Subscription;

    /**
     * Information about connected peer at the end
     */
    endPeer: SvgPeerDropArea;
}

/**
 * Information about currenctly active drop peer
 */
export interface SvgPeerDropArea
{
    /**
     * Svg node that has active drop area
     */
    svgNode: SvgNodeDynamicNode;

    /**
     * Name of input which has active drop area
     */
    inputId: string;

    /**
     * Indication whether is drop zone dynamic or not
     */
    dynamic: boolean;
}

/**
 * Coordinates of point in node designer
 */
export interface Coordinates
{
    /**
     * X coordinate of point
     */
    x?: number;

    /**
     * Y coordinate of point
     */
    y?: number;
}