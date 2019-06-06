import {DynamicNode} from "../dynamicNode";

/**
 * Description of dynamic component
 */
export interface DynamicComponent extends DynamicNode
{
    /**
     * Options used for rendering this component
     */
    options: any;
}

/**
 * Description of dynamic component generic
 */
export interface DynamicComponentGeneric<TOptions> extends DynamicComponent
{
    /**
     * Options used for rendering this component
     */
    options: TOptions;
}