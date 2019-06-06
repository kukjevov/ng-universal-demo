/**
 * Options for script node
 */
export interface ScriptNodeOptions
{
    /**
     * Script that will be executed
     */
    script?: string;

    /**
     * Type of interface that is implemented by script
     */
    interface?: ScriptNodeInterface;

    /**
     * Additional external references
     */
    references?: string[];
}

/**
 * Type of interface that can be implemented by script node
 */
export enum ScriptNodeInterface
{
    /**
     * Allows transformation of any type to any type
     */
    Transform,

    /**
     * Allows to transform response of http request to any type
     */
    ResponseTransform
}