import {NodeDefinition, DynamicOutput} from "../../ngDynamic-core";
import {DynamicNodeDesignerMetadata} from "../../ngDynamic-designer";

/**
 * Node used for negating input value
 */
@DynamicNodeDesignerMetadata(
{
    relationsMetadata:
    {
        name: 'Negate',
        description: 'Negates input data and returns negated value',
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
                id: 'value',
                name: 'value',
                type: 'boolean'
            }
        ]
    }
})
export class NegateNode implements NodeDefinition
{
    //######################### public properties #########################

    /**
     * Negated value output
     */
    @DynamicOutput()
    public value: boolean;

    /**
     * Input value to be negated
     */
    public input: any;

    //######################### public methods #########################
    
    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this.value = !this.input;
    }

    /**
     * Destroys everything that should be destroyed and frees memory
     */
    public destroy(): void
    {
    }
}