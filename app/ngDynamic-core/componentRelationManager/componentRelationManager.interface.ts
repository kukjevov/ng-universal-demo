import {Subscription} from "rxjs";

import {NodeDefinition} from "../interfaces";

/**
 * Metadata for single component`s output for relation manager
 */
export interface DynamicComponentRelationManagerInputOutputMetadata
{
    /**
     * Name of output to be mapped
     */
    outputName?: string;

    /**
     * Name of input be mapped
     */
    inputName?: string;

    /**
     * Id of node which contains this input
     */
    inputId?: string;

    /**
     * Id of output component which is attached to this input
     */
    outputNodeId?: string;

    /**
     * Instance of node containing this input
     */
    inputInstance?: any;
}

/**
 * Metadata for single component relations
 */
export interface DynamicComponentRelationManagerMetadata
{
    /**
     * Instance of node
     */
    nodeInstance?: NodeDefinition;

    /**
     * Definition of all outputs and their connections to inputs
     */
    inputOutputs?: DynamicComponentRelationManagerInputOutputMetadata[];

    /**
     * Array of subscriptions for changes of outputs for component
     */
    outputsChangeSubscriptions?: Subscription[];
}