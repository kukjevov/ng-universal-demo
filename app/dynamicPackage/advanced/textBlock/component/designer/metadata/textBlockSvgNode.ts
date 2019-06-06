import {Selection, BaseType} from 'd3';
import {Injector} from '@angular/core';

import {SvgNodeDynamicNode, CodeMetadata, DesignerPageComponent, CodeService, RelationsMetadata, SvgPeerDropArea, SvgRelationDynamicNode, INVALIDATE_CODE} from "../../../../../../ngDynamic-designer";
import {SvgNode} from "../../../../../../ngDynamic-designer/components/nodeDesigner/misc";
import {DesignerMode} from "../../../../../../ngDynamic-designer/components/designer.interface";
import {TextBlockDesignerComponent} from "../component";

/**
 * Implementation of custom SVG node for advanced text block
 */
export class TextBlockSvgNode extends SvgNode implements SvgNodeDynamicNode
{
    //######################### private fields #########################

    /**
     * Component that is connected with this node
     */
    private _component: TextBlockDesignerComponent;

    //######################### protected fields #########################

    /**
     * Code metadata
     */
    protected _codeMetadata: CodeMetadata =
    {
        language: 'handlebars',
        template: '',
        dynamicNodeInstance: this
    };

    //######################### constructor #########################
    constructor(parentGroup: Selection<BaseType, {}, null, undefined>,
                metadata: RelationsMetadata,
                validDropToggle: (dropArea: SvgPeerDropArea) => void,
                createRelation: () => SvgRelationDynamicNode,
                injector: Injector,
                layoutComponent: TextBlockDesignerComponent,
                nodeOptions: any)
    {
        super(parentGroup, metadata, validDropToggle, createRelation, injector, layoutComponent, nodeOptions);

        this._component = layoutComponent;
        this._codeMetadata.template = this._component.getTemplate();
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     */
    public invalidateVisuals(propertyName?: string): void
    {
        super.invalidateVisuals(propertyName);

        if(propertyName == INVALIDATE_CODE)
        {
            this._component.setTemplate(this._codeMetadata.value);
            this._component.invalidateVisuals();
        }
    }

    //######################### protected methods #########################

    /**
     * Renders misc visuals
     */
    protected _renderVisuals()
    {
        super._renderVisuals();
        let currentHeight = this._getHeight();

        let buttonGroup = this._miscGroup.append('g')
            .on('click', () =>
            {
                this._injector.get(DesignerPageComponent).setMode(DesignerMode.CODE);
                this._injector.get(CodeService).showCode(this._codeMetadata);
            });

        buttonGroup.append("rect")
                .attr('x', 45)
                .attr('y', currentHeight - 25)
                .attr('width', 100)
                .attr('height', 20)
                .attr('fill', '#569cd6')
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('style', "cursor: pointer;");

        buttonGroup.append('text')
            .text('Show template')
                .attr('x', 50)
                .attr('y', currentHeight - 11)
                .attr('fill', '#F8F8F8')
                .attr('style', "cursor: pointer;");
    }
}