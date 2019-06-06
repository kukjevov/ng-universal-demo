import {InjectionToken} from "@angular/core";

import {Coordinates, PropertiesMetadata, RelationsMetadata, RelationsInputOutputMetadata, SvgRelationDynamicNode} from "../../interfaces";

/**
 * Constant represents name of invalidation for svg drop relation
 */
export const INVALIDATE_DROP: string = 'drop';

/**
 * Token used for obtaining node properties service
 */
export const NODE_PROPERTIES_SERVICE: InjectionToken<NodePropertiesService> = new InjectionToken<NodePropertiesService>('NODE_PROPERTIES_SERVICE');

/**
 * Represents state of single node
 */
export interface NodeDesignerNodeState
{
    /**
     * Id of node
     */
    id: string;

    /**
     * Coordinates of node
     */
    position?: Coordinates;

    /**
     * Indication whether is node component node
     */
    componentNode?: boolean;

    /**
     * Stores additional data for node that are need to keep its full state
     */
    additionalData?: any;
}

/**
 * Node properties service description
 */
export interface NodePropertiesService
{
    /**
     * Shows properties by metadata in properties component
     * @param PropertiesMetadata Metadata that should be loaded into properties component
     */
    showProperties(PropertiesMetadata: PropertiesMetadata);
}

/**
 * Internal metadata used for node relations designer
 */
export interface ɵRelationsMetadata extends RelationsMetadata
{
    /**
     * Array of inputs definitions
     */
    inputs?: ɵRelationsInputOutputMetadata[];

    /**
     * Array of output definitions
     */
    outputs?: ɵRelationsInputOutputMetadata[];

    /**
     * Type of node that is constructed
     */
    nodeType?: string;

    /**
     * X coordinates of node
     */
    x?: number;

    /**
     * Y coordinates of node
     */
    y?: number;
}

/**
 * Internal defintion of input or output relation metadata
 */
export interface ɵRelationsInputOutputMetadata extends RelationsInputOutputMetadata
{
    /**
     * Computed Y coordinate
     */
    y?: number;

    /**
     * Relations that are connected to this peer
     */
    relations?: SvgRelationDynamicNode[];
}

/**
 * Internal defintion of dynamic input relation metadata
 */
export interface ɵDynamicRelationsInputMetadata extends ɵRelationsInputOutputMetadata
{
    /**
     * Special unique generated id that cant be changed, used for pairing and matching dynamic inputs with outputs
     */
    ɵId?: string;
}
