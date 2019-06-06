import {FlatTreeControl} from "@angular/cdk/tree";

/**
 * Class that represents Tree control
 */
export class AdvancedFlatTreeControl<T> extends FlatTreeControl<T>
{
    //######################### constructor #########################
    constructor(getLevel: (dataNode: T) => number, 
                isExpandable: (dataNode: T) => boolean, 
                public getNodeId: (dateNode: T) => any)
    {
        super(getLevel, isExpandable);
    }

    //######################### public methods #########################

    /**
     * Expands all data nodes
     */
    public expandAll(): void
    {
        //TODO not yet implemented!
        throw new Error("Not yet implemented!");
    }

    /** 
     * Toggles one single data node's expanded/collapsed state. 
     */
    public toggle(dataNode: T): void 
    {
        this.expansionModel.toggle(this.getNodeId(dataNode));
    }

    /** 
     * Expands one single data node. 
     */
    public expand(dataNode: T): void 
    {
        this.expansionModel.select(this.getNodeId(dataNode));
    }

    /** 
     * Collapses one single data node. 
     */
    public collapse(dataNode: T): void 
    {
        this.expansionModel.deselect(this.getNodeId(dataNode));
    }

    /** 
     * Whether a given data node is expanded or not. Returns true if the data node is expanded. 
     */
    public isExpanded(dataNode: T): boolean 
    {
        return this.expansionModel.isSelected(this.getNodeId(dataNode));
    }

    /** 
     * Toggles a subtree rooted at `node` recursively. 
     */
    public toggleDescendants(dataNode: T): void 
    {
        this.expansionModel.isSelected(this.getNodeId(dataNode))
            ? this.collapseDescendants(dataNode)
            : this.expandDescendants(dataNode);
    }
}