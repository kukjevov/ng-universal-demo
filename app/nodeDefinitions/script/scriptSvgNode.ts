import {Injector} from '@angular/core';
import {isBlank} from '@asseco/common';
import {Selection, BaseType} from 'd3';

import {SvgNodeDynamicNode, DesignerPageComponent, CodeService, CodeMetadata, ɵRelationsMetadata, SvgPeerDropArea, SvgRelationDynamicNode, DesignerLayoutPlaceholderComponent, INVALIDATE_PROPERTIES} from "../../ngDynamic-designer";
import {SvgNode} from "../../ngDynamic-designer/components/nodeDesigner/misc";
import {DesignerMode} from "../../ngDynamic-designer/components/designer.interface";
import {DynamicComponentRelationMetadata, DynamicComponentRelationMetadataGeneric} from "../../ngDynamic-core";
import {ScriptNodeOptions, ScriptNodeInterface} from "./script.interface";
import {scriptNodeTemplates} from "./script.templates";

/**
 * Implementation of custom SVG node for script
 */
export class ScriptSvgNode extends SvgNode implements SvgNodeDynamicNode
{
    //######################### protected fields #########################

    /**
     * Currently set interface type
     */
    protected _interfaceValue: ScriptNodeInterface;

    /**
     * Code metadata
     */
    protected _codeMetadata: CodeMetadata =
    {
        name: 'ScriptNode',
        language: 'typescript',
        template: scriptNodeTemplates[ScriptNodeInterface.Transform],
        additionalData:
        {
            typings:
            [
                require('./interfaces/scriptNode.typings')
            ],
            references:
            [
                'rxjs',
                'rxjs/operators',
                'moment'
            ]
        },
        dynamicNodeInstance: this
    };

    //######################### public properties #########################

    /**
     * Additional data that needs to be stored for node
     */
    public get additionalData(): string
    {
        return this._codeMetadata.value;
    }
    public set additionalData(value: string)
    {
        this._codeMetadata.value = value;
    }

    //######################### constructor #########################
    constructor(parentGroup: Selection<BaseType, {}, null, undefined>,
                metadata: ɵRelationsMetadata,
                validDropToggle: (dropArea: SvgPeerDropArea) => void,
                createRelation: () => SvgRelationDynamicNode,
                injector: Injector,
                layoutComponent: DesignerLayoutPlaceholderComponent,
                nodeOptions: ScriptNodeOptions)
    {
        super(parentGroup, metadata, validDropToggle, createRelation, injector, layoutComponent, ScriptSvgNode._setDefault(nodeOptions));

        this._interfaceValue = (this._properties.value as ScriptNodeOptions).interface;
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     * @param initial Indication whether is invalidation initial, or on event
     */
    public invalidateVisuals(propertyName?: string, initial?: boolean): void
    {
        super.invalidateVisuals(propertyName);

        if(propertyName == INVALIDATE_PROPERTIES && !initial)
        {
            this._showCode();
        }
    }

    //######################### protected methods #########################

    /**
     * Gets metadata for current node
     */
    protected async _getMetadata(): Promise<DynamicComponentRelationMetadata>
    {
        let metadata: DynamicComponentRelationMetadataGeneric<ScriptNodeOptions> = await super._getMetadata();

        let compiledScript = await this._injector.get(CodeService).getCompiled(this._codeMetadata)
            .catch(error => alert(`Unable to get compiled output Error: '${error}'`)) as string;

        metadata.nodeOptions.script = compiledScript;

        return metadata;
    }

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
                this._showCode();
            });

        buttonGroup.append("rect")
                .attr('x', 45)
                .attr('y', currentHeight - 25)
                .attr('width', 75)
                .attr('height', 20)
                .attr('fill', '#569cd6')
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('style', "cursor: pointer;");

        buttonGroup.append('text')
            .text('Show code')
                .attr('x', 50)
                .attr('y', currentHeight - 11)
                .attr('fill', '#F8F8F8')
                .attr('style', "cursor: pointer;");
    }

    /**
     * Sets default value for interface
     * @param options Options to be set with default
     */
    protected static _setDefault(options: ScriptNodeOptions): ScriptNodeOptions
    {
        if(!options)
        {
            options = {};
        }

        if(isBlank(options.interface))
        {
            options.interface = ScriptNodeInterface.Transform
        }

        return options;
    }

    /**
     * Shows code in code editor
     */
    protected _showCode()
    {
        if((this._properties.value as ScriptNodeOptions).interface != this._interfaceValue)
        {
            this._interfaceValue = (this._properties.value as ScriptNodeOptions).interface;
            this._codeMetadata.template = this._codeMetadata.value = scriptNodeTemplates[this._interfaceValue];
        }

        this._injector.get(DesignerPageComponent).setMode(DesignerMode.CODE);
        this._injector.get(CodeService).showCode(this._codeMetadata);
    }
}