import {ActivatedRouteNode} from './activatedRoute';
import {ScriptNode} from './script';
import {NegateNode} from './negate';
import {RestClientNode} from './restClient';
import {ComponentActionNode} from './componentAction';
import {NodeDefinitionConstructor} from '../ngDynamic-core';

export {RestClientNodeOptions, RestClientParamType, RestClientMethodType, RestClientNodeParameter} from './restClient/restClient.interface';
export {ActionDescription} from './componentAction/componentAction.interface';
export {ScriptNodeOptions} from './script/script.interface';

/**
 * Definitions of nodes
 */
export const nodeDefinitions: {[name: string]: NodeDefinitionConstructor} =
{
    ActivatedRouteNode,
    ScriptNode,
    NegateNode,
    RestClientNode,
    ComponentActionNode
};



