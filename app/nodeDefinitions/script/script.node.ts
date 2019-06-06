import {Injector, Type} from "@angular/core";
import {getEnumValues} from "@asseco/common";

import {ScriptLoader, DynamicOutput, NodeDefinitionGeneric} from "../../ngDynamic-core";
import {DynamicNodeDesignerMetadata, PropertyType} from "../../ngDynamic-designer";
import {ScriptNodeOptions, ScriptNodeInterface} from "./script.interface";
import {ScriptSvgNode} from "./scriptSvgNode";
import {TransformScript} from './interfaces/transform';
import {ResponseTransformScript} from './interfaces/responseTransform';

/**
 * Node used for calling custom scripts
 */
@DynamicNodeDesignerMetadata(
{
    relationsMetadata:
    {
        name: 'Script',
        description: 'Allows you to create custom script to be executed',
        inputs:
        [
            {
                id: 'input',
                name: 'input',
                type: 'any'
            }
        ],
        outputs:
        [
            {
                id: 'output',
                name: 'output',
                type: 'any'
            }
        ],
        nodeOptionsMetadata:
        [
            {
                id: 'interface',
                name: 'Interface',
                description: 'Type of interface that is implemented by this script',
                type: PropertyType.Options,
                availableValues: getEnumValues(ScriptNodeInterface),
                defaultValue: 0
            },
            {
                id: 'references',
                name: 'NPM references',
                description: 'Array of packages that are available for usage in script',
                type: PropertyType.Array,
                defaultValue: []
            }
        ],
        customNode: ScriptSvgNode
    }
})
export class ScriptNode implements NodeDefinitionGeneric<ScriptNodeOptions>
{
    //######################### private fields #########################

    /**
     * Script loader used for loading types and scripts
     */
    private _scriptLoader: ScriptLoader;

    //######################### public properties #########################

    /**
     * Options for node
     */
    public options: ScriptNodeOptions;

    /**
     * Input to be mapped
     */
    public input: any;

    /**
     * Output to be mapped
     */
    @DynamicOutput()
    public output: any;

    //######################### constructor #########################
    constructor(injector: Injector)
    {
        this._scriptLoader = injector.get(ScriptLoader);
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals()
    {
        let type = this._scriptLoader.loadType(this.options.script, this.options.references);

        if(this.options.interface == ScriptNodeInterface.Transform)
        {
            let genericType: Type<TransformScript> = type;

            this.output = new genericType().transform(this.input);
        }
        else if(this.options.interface == ScriptNodeInterface.ResponseTransform)
        {
            let genericType: Type<ResponseTransformScript> = type;

            this.output = new genericType().responseTransform(this.input);
        }
    }

    /**
     * Destroys everything that should be destroyed and frees memory
     */
    public destroy(): void
    {
    }
}