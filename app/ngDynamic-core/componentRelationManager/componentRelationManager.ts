import {Injector} from "@angular/core";
import {isBlank} from "@asseco/common";

import {DynamicComponentRelationMetadata, DynamicNode, NodeDefinitionConstructor, NodeDefinition} from "../interfaces";
import {ComponentManager} from "../componentManager";
import {DynamicComponentRelationManagerMetadata, DynamicComponentRelationManagerInputOutputMetadata} from "./componentRelationManager.interface";

/**
 * Manager used for handling relations between components
 */
export class ComponentRelationManager
{
    //######################### private fields #########################

    /**
     * Relations metadata
     */
    private _relations: {[id: string]: DynamicComponentRelationManagerMetadata} = {};

    /**
     * Array of backward relations, relations that are used for obtaining data for inputs
     */
    private _backwardRelations: {[id: string]: DynamicComponentRelationManagerInputOutputMetadata[]} = {};

    /**
     * Component manager
     */
    private _componentManager: ComponentManager;

    /**
     * Indication whether is this instance of relation manager initialized
     */
    private _initialized: boolean = false;

    //######################### private properties #########################

    /**
     * Gets instance of component manager
     */
    private get componentManager(): ComponentManager
    {
        if(!this._componentManager)
        {
            this._componentManager = this._injector.get<ComponentManager>(ComponentManager);
        }

        return this._componentManager;
    }

    //######################### constructor #########################
    constructor(private _metadata: DynamicComponentRelationMetadata[], private _injector: Injector)
    {
    }
    
    //######################### public methods #########################

    /**
     * Initialize relations manager
     */
    public async initialize()
    {
        if(!this._initialized)
        {
            await this._initializeRelations(this._metadata);
            
            this._initialized = true;
        }
    }

    /**
     * Registers newly created component
     * @param id Id of component to be registered
     * @param component Component instance
     */
    public updateRelations(id: string, component: DynamicNode)
    {
        let metadata: DynamicComponentRelationManagerMetadata = this._relations[id];
        let backwardMetadata = this._backwardRelations[id];

        //this component has no relations
        if(!metadata && (!backwardMetadata || !backwardMetadata.length))
        {
            return;
        }

        //initialize default value from connection to this
        if(backwardMetadata && backwardMetadata.length)
        {
            backwardMetadata.forEach(inputOutput =>
            {
                inputOutput.inputInstance = component;

                this._initBackwardRelation(inputOutput.outputNodeId, inputOutput);
            });
        }

        if(metadata)
        {
            metadata.inputOutputs.forEach(inputOutput =>
            {
                //initialize default value from this to its connections
                this._transferData(component, inputOutput.outputName, inputOutput.inputInstance, inputOutput.inputName, true);

                //set listening for output changes
                metadata.outputsChangeSubscriptions.push(component[`${inputOutput.outputName}Change`].subscribe(() =>
                {
                    this._transferData(component, inputOutput.outputName, inputOutput.inputInstance, inputOutput.inputName, false);
                }));
            });
        }
    }
    
    /**
     * Method used for destroying component
     */
    public destroyComponent(id: string)
    {
        let metadata: DynamicComponentRelationManagerMetadata = this._relations[id];
        let backwardMetadata = this._backwardRelations[id];

        //destroy backward relations
        if(backwardMetadata && backwardMetadata.length)
        {
            backwardMetadata.forEach(inputoutput =>
            {
                inputoutput.inputInstance = null;
            });
        }

        //destroy relations
        if(metadata)
        {
            metadata.outputsChangeSubscriptions.forEach(subscription => subscription.unsubscribe());
            metadata.outputsChangeSubscriptions = [];

            if(metadata.nodeInstance)
            {
                metadata.nodeInstance.destroy();
            }
        }
    }

    /**
     * Method destroys component relation manager instance
     */
    public destroy()
    {
        Object.keys(this._relations).forEach(id => this.destroyComponent(id));

        this._relations = {};
        this._backwardRelations = {};
    }

    //######################### private methods #########################

    /**
     * Initialize relations from metadata
     * @param metadata Metadata to be used for initialization of relations
     */
    private async _initializeRelations(metadata: DynamicComponentRelationMetadata[])
    {
        if(isBlank(metadata))
        {
            return;
        }

        if(!Array.isArray(metadata))
        {
            throw new Error("Metadata are not an array");
        }

        for(let meta of metadata)
        {
            let outputs: DynamicComponentRelationManagerInputOutputMetadata[] = [];

            meta.outputs.forEach(output =>
            {
                output.inputs.forEach(input =>
                {
                    let relation = this._relations[input.id];
                    let nodeInstance = relation && relation.nodeInstance ? relation.nodeInstance : null;

                    let inputOutput: DynamicComponentRelationManagerInputOutputMetadata = 
                    {
                        inputId: input.id,
                        outputNodeId: meta.id,
                        inputName: input.inputName,
                        outputName: output.outputName,
                        inputInstance: nodeInstance || this.componentManager.get(input.id)
                    };

                    outputs.push(inputOutput);

                    if(!this._backwardRelations[input.id])
                    {
                        this._backwardRelations[input.id] = [];
                    }

                    this._backwardRelations[input.id].push(inputOutput);
                });
            });

            let nodeInstance: NodeDefinition = null;

            if(meta.nodeType)
            {
                let nodeDefinitions: {[name: string]: NodeDefinitionConstructor} = (await import(`../../nodeDefinitions`)
                    .catch(error =>
                    {
                        throw new Error(`Unable to load dynamic nodes package, missing @ngDynamic/nodeDefinitions, error '${error}'.`);
                    })).nodeDefinitions;

                if(!nodeDefinitions[`${meta.nodeType}Node`])
                {
                    throw new Error(`Unable to find node type '${meta.nodeType}'!`);
                }

                nodeInstance = new nodeDefinitions[`${meta.nodeType}Node`](this._injector);

                if(meta.nodeOptions)
                {
                    nodeInstance.options = meta.nodeOptions;
                }
            }

            this._relations[meta.id] =
            {
                nodeInstance: nodeInstance,
                inputOutputs: outputs,
                outputsChangeSubscriptions: []
            };

            if(nodeInstance)
            {
                this.updateRelations(meta.id, nodeInstance);
            }
        };
    }

    /**
     * Initialize backward relation
     * @param id Id of component that is source of relation
     * @param inputOutputMetadata Metadata for input and output
     */
    private _initBackwardRelation(id: string, inputOutputMetadata: DynamicComponentRelationManagerInputOutputMetadata)
    {
        let relation = this._relations[id];
        let nodeInstance = relation && relation.nodeInstance;

        this._transferData(nodeInstance || this.componentManager.get(id), inputOutputMetadata.outputName, inputOutputMetadata.inputInstance, inputOutputMetadata.inputName, true);
    }

    /**
     * Transfers data from source property to target property
     * @param source Instance of source object containing source property with data
     * @param sourceProperty Name of source property with data that are transfered
     * @param target Instance of target object containing target property for data
     * @param targetProperty Name of target property which will be filled with data
     * @param initial Indication whether is transfer of data initial, or on event
     */
    private _transferData(source: DynamicNode, sourceProperty: string, target: DynamicNode, targetProperty: string, initial: boolean)
    {
        if(!source || !target)
        {
            return;
        }

        target[targetProperty] = source[sourceProperty];
        target.invalidateVisuals(targetProperty, initial);
    }
}