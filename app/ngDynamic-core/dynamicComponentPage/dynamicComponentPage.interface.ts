import {DynamicComponentMetadata, DynamicComponentRelationMetadata} from "../interfaces";

/**
 * Represents dynamic content netadata
 */
export interface DynamicContentMetadata
{
    /**
     * Metadata for layout out dynamic content
     */
    layout?: DynamicComponentMetadata;

    /**
     * Metadata for setting up connections between dynamic content
     */
    relations?: DynamicComponentRelationMetadata[];
}

/**
 * Represents remote dynamic content metadata
 */
export interface RemoteDynamicContentMetadata
{
    /**
     * Metadata for layout out dynamic content serialized
     */
    layout?: string;

    /**
     * Metadata for setting up connections between dynamic content serialized
     */
    relations?: string;
}