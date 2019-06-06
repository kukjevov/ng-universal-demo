import {RelationsMetadata} from "../../../../../../ngDynamic-designer";
import {TextBlockSvgNode} from "./textBlockSvgNode";

export const relationsMetadata: RelationsMetadata =
{
    name: 'Text block',
    description: 'Advanced text block with custom html template for displaying objects',
    inputs:
    [
        {
            id: 'data',
            name: 'data',
            type: 'any'
        }
    ],
    customNode: TextBlockSvgNode
};