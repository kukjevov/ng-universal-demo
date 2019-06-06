import {DesignerMetadataClass, DesignerNodeMetadata} from "../interfaces";
import {ɵRelationsMetadata} from "../components";

declare var designerMetadata: boolean;

/**
 * Sets node designer metadata to class on which is this decorator applied
 * @returns ClassDecorator
 */
export function DynamicNodeDesignerMetadata(metadata: DesignerNodeMetadata): ClassDecorator
{
    if(designerMetadata)
    {
        return function <TFunction extends Function> (target: TFunction): TFunction
        {
            let metadataTarget: DesignerMetadataClass = target as any;
            metadataTarget.ɵMetadata = metadata;

            if(metadata.relationsMetadata)
            {
                (metadata.relationsMetadata as ɵRelationsMetadata).nodeType = target.name.replace(/Node$/, '');
            }

            return target;
        };
    }

    return function <TFunction extends Function> (target: TFunction): TFunction
    {
        return target;
    };
}