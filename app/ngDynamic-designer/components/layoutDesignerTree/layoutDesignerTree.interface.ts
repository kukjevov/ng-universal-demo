/**
 * Represents layout metadata tree node
 */
export interface LayoutComponentTreeNode
{
    /**
     * Id of node
     */
    id: number|string,

    /**
     * Depth of node
     */
    level?: number,

    /**
     * Component options
     */
    options: any,

    /**
     * Node children
     */
    children: LayoutComponentTreeNode[],

    /**
     * Node parent
     */
    parent: LayoutComponentTreeNode
}