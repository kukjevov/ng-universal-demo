import {DynamicComponentMetadata} from "../../../../ngDynamic-core";

/**
 * Options for one grid component child
 */
export interface GridComponentChildOptions
{
    /**
     * Component to be rendered at this position
     */
    content?: DynamicComponentMetadata;

    /**
     * Define position of component at grid columns or rows
     */
    area?: string;
}

/**
 * Grid layout component options
 */
export interface GridComponentOptions
{
    /**
     * Definition of grid template rows
     */
    rows?: string;

    /**
     * Definition of grid template columns
     */
    columns?: string;

    /**
     * Size of gap between rows
     */
    rowGap?: string;

    /**
     * Size of gap between columns
     */
    columnGap?: string;

    /**
     * Array of children that are going to be rendered
     */
    children?: GridComponentChildOptions[];
}