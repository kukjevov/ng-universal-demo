import {RelationsMetadata} from "../../../../../../ngDynamic-designer";

export const relationsMetadata: RelationsMetadata =
{
    name: 'Conditional block',
    description: 'Conditional block that displays its content when condition is met',
    inputs:
    [
        {
            id: 'condition',
            name: 'condition',
            type: 'boolean'
        }
    ]
};