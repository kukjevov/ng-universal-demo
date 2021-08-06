import {DesignerLayoutMetadata, DesignerMetadataClass} from '../interfaces';

declare let designerMetadata: boolean;

/**
 * Sets designer metadata to class on which is this decorator applied
 * @returns ClassDecorator
 */
export function DynamicComponentDesignerMetadata(metadata: DesignerLayoutMetadata): ClassDecorator
{
    if(designerMetadata)
    {
        return function <TFunction extends Function> (target: TFunction): TFunction
        {
            const metadataTarget: DesignerMetadataClass = target as any;
            metadataTarget.ɵMetadata = metadata;

            return target;
        };
    }

    return function <TFunction extends Function> (target: TFunction): TFunction
    {
        return target;
    };
}