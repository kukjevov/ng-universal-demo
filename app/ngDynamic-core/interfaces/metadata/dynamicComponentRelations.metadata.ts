/**
 * Metadata for single component`s input
 */
export interface DynamicComponentRelationInputMetadata
{
    /**
     * Name of input be mapped
     */
    inputName?: string;

    /**
     * Id of node which contains this input
     */
    id?: string;
}

/**
 * Metadata for single component`s output
 */
export interface DynamicComponentRelationOutputMetadata
{
    /**
     * Name of output to be mapped
     */
    outputName?: string;

    /**
     * Inputs which are connected to this output
     */
    inputs?: DynamicComponentRelationInputMetadata[];
}

/**
 * Metadata for single component relations
 */
export interface DynamicComponentRelationMetadata
{
    /**
     * Unique id of component which outputs will be connected
     */
    id?: string;

    /**
     * Name of node type, that should be constructed instead of component
     */
    nodeType?: string;

    /**
     * Options for node type
     */
    nodeOptions?: any;

    /**
     * Definition of all outputs and their connections
     */
    outputs?: DynamicComponentRelationOutputMetadata[];
}

/**
 * Metadata for single component relations generic
 */
export interface DynamicComponentRelationMetadataGeneric<TOptions> extends DynamicComponentRelationMetadata
{
    /**
     * Options for node type
     */
    nodeOptions?: TOptions;
}