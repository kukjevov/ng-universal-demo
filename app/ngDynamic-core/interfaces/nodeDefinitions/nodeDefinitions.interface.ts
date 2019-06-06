import {Injector} from "@angular/core";

import {DynamicNode} from "../dynamicNode";

/**
 * Definition of node constructor
 */
export interface NodeDefinitionConstructor
{
    new (injector: Injector): NodeDefinition;
}

/**
 * Definition of node instance
 */
export interface NodeDefinition extends DynamicNode
{
    /**
     * Options for node
     */
    options?: any;

    /**
     * Destroys everything that should be destroyed and frees memory
     */
    destroy(): void;
}

export interface NodeDefinitionGeneric<TOptions> extends NodeDefinition
{
    /**
     * Options for node
     */
    options: TOptions;
}