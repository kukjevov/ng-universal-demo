import {LayoutMetadata, PropertyType} from "../../../../../../ngDynamic-designer";

export const layoutMetadata: LayoutMetadata =
{
    name: 'stack panel',
    description: 'Stack panel as layout for components in row or column',
    iconCssClass: 'fa fa-window-maximize',
    properties:
    [
        {
            id: 'inline',
            name: 'inline',
            description: 'Indication whether added components are rendered in row or column',
            type: PropertyType.Boolean,
            defaultValue: false
        },
        {
            id: 'padding.top',
            name: 'top padding',
            description: 'Inset offset from top of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: null
        },
        {
            id: 'padding.left',
            name: 'left padding',
            description: 'Inset offset from left of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: null
        },
        {
            id: 'padding.right',
            name: 'right padding',
            description: 'Inset offset from right of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: null
        },
        {
            id: 'padding.bottom',
            name: 'bottom padding',
            description: 'Inset offset from bottom of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: null
        },
        {
            id: 'margin.top',
            name: 'top margin',
            description: 'Inset offset from top of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.left',
            name: 'left margin',
            description: 'Inset offset from left of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.right',
            name: 'right margin',
            description: 'Inset offset from right of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: 10
        },
        {
            id: 'margin.bottom',
            name: 'bottom margin',
            description: 'Inset offset from bottom of each child of stack panel',
            type: PropertyType.Number,
            defaultValue: 10
        }
    ]
};