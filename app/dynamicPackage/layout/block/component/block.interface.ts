import {DynamicComponentMetadata} from "../../../../ngDynamic-core";
import {Padding, Margin} from "../../layout.interface";

/**
 * Block layout component options
 */
export interface BlockComponentOptions
{
    /**
     * Content component
     */
    content?: DynamicComponentMetadata;

    /**
     * Padding applied to content component`s div
     */
    padding?: Padding;

    /**
     * Margin applied to content component`s div
     */
    margin?: Margin;

    /**
     * Background applied to content component`s div
     */
    background?: string;

    /**
     Font size applied to content component`s div
     */
    fontSize?: number;
}