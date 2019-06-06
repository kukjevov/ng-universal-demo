import {LayoutMetadata, PropertyType, LeftTopRightBottomNumberComponent} from "../../../../../../ngDynamic-designer";

export const layoutMetadata: LayoutMetadata =
{
    name: 'Block panel',
    description: 'Block panel as layout component',
    iconCssClass: 'fa fa-file-o',
    properties:
    [
        {
            id: 'padding',
            name: 'Padding',
            description: 'Inset offset of content of panel',
            type: PropertyType.CustomType,
            customTypeComponent: 
            {
                component: LeftTopRightBottomNumberComponent,
                module: null,
                moduleFactory: null
            }
        },
        {
            id: 'margin.top',
            name: 'Top margin',
            description: 'Outside offset from top of content of panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.right',
            name: 'Right margin',
            description: 'Outside offset from right of content of panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.bottom',
            name: 'Bottom margin',
            description: 'Outside offset from bottom of content of panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.left',
            name: 'Left margin',
            description: 'Outside offset from left of content of panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'fontSize',
            name: 'Font size',
            description: 'Size of font for inner content',
            type: PropertyType.Number,
            defaultValue: null
        },
        {
            id: 'background',
            name: 'Background color RGB code',
            description: 'Background color of panel',
            type: PropertyType.String,
            defaultValue: null
        }
    ]
};