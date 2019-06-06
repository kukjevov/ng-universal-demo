import {DynamicComponentMetadata} from "../../../../ngDynamic-core";
import {Padding, Margin} from "../../layout.interface";

/**
 * Stack component options
 */
export interface StackComponentOptions
{
    /**
     * Indication whether inline stacked elements
     */
    inline?: boolean;

    /**
     * Array of children that are going to be rendered
     */
    children?: DynamicComponentMetadata[];

    /**
     * Padding of stack layout component`s children
     */
    padding?: Padding;

    /**
     * Margin of stack layout component`s children
     */
    margin?: Margin;
}