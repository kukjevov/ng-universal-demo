import {DynamicModuleDescription} from "../../dynamicModuleLoader";

/**
 * Metadata used for rendering dynamic components
 */
export interface DynamicComponentMetadata extends DynamicModuleDescription
{
    /**
     * Unique id identifying component in current view
     */
    id: string;

    /**
     * Options passed to component
     */
    options: any;
}

/**
 * Metadata used for rendering dynamic components generic
 */
export interface DynamicComponentMetadataGeneric<TOptions> extends DynamicComponentMetadata
{
    /**
     * Options passed to component
     */
    options: TOptions;
}