/**
 * Interface for defining padding of layout component
 */
export interface Padding
{
    /**
     * Top offset in pixels
     */
    top?: number;

    /**
     * Left offset in pixels
     */
    left?: number;

    /**
     * Right offset in pixels
     */
    right?: number;

    /**
     * Bottom offset in pixels
     */
    bottom?: number;
}

/**
 * Interface for defining margin of layout element
 */
export interface Margin extends Padding
{
}