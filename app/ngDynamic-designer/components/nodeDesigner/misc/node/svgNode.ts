import {Injector} from '@angular/core';
import {isPresent} from '@asseco/common';
import {Selection, BaseType, drag, event, select} from 'd3';
import {Subject, Observable} from 'rxjs';

import {Coordinates, SvgRelationDynamicNode, SvgNodeDynamicNode, SvgPeerDropArea, PropertiesMetadata, DesignerLayoutPlaceholderComponent, INVALIDATE_PROPERTIES} from '../../../../interfaces';
import {transformOptionsToProperties, transformPropertiesToOptions} from '../../../../misc';
import {DynamicComponentRelationMetadata, DynamicComponentRelationOutputMetadata, DynamicComponentRelationInputMetadata} from '../../../../../ngDynamic-core';
import {INVALIDATE_DROP, NODE_PROPERTIES_SERVICE, ɵDynamicRelationsInputMetadata, ɵRelationsMetadata} from '../../nodeDesigner.interface';

/**
 * Offset of first peer in node
 */
const peerOffset: number = 55;

/**
 * Minimal height of node
 */
const minHeight: number = 150;

/**
 * Size of step for next peers
 */
const peerStep: number = 25;

/**
 * Static width of node
 */
export const nodeWidth: number = 180;

/**
 * Class that represents SVG node and interaction with it
 */
export class SvgNode implements SvgNodeDynamicNode
{
    //######################### protected fields #########################

/**
     * Subject used for emitting destroying event
     */
    protected _destroyingSubject: Subject<SvgNodeDynamicNode> = new Subject<SvgNodeDynamicNode>();

    /**
     * Node group that represents this node
     */
    protected _nodeGroup: Selection<BaseType, {}, null, undefined>;

    /**
     * Group for misc stuff rendered for
     */
    protected _miscGroup: Selection<BaseType, {}, null, undefined>;

    /**
     * Group of inputs circles
     */
    protected _inputsGroup: Selection<BaseType, {}, null, undefined>;

    /**
     * Group of dynamic inputs circles
     */
    protected _dynamicInputsGroup: Selection<BaseType, {}, null, undefined>;

    /**
     * Group of output circles
     */
    protected _outputsGroup: Selection<BaseType, {}, null, undefined>;

    /**
     * Properties metadata, used for changes node options
     */
    protected _properties: PropertiesMetadata;

    /**
     * X coordinate of node
     */
    protected _nodeX: number;

    /**
     * Y coordinate of node
     */
    protected _nodeY: number;

    /**
     * Array of dynamic inputs
     */
    protected _dynamicInputs: ɵDynamicRelationsInputMetadata[] = [];

    //######################### public properties #########################

    /**
     * Unique id of node which is connected to other nodes
     */
    public get id(): string
    {
        return this._metadata.id;
    }

    /**
     * X and Y coordinates of node
     */
    public get position(): Coordinates
    {
        return {
            x: this._nodeX,
            y: this._nodeY
        }
    }

    /**
     * Gets metadata of current node
     */
    public get metadata(): Promise<DynamicComponentRelationMetadata>
    {
        return this._getMetadata();
    }

    /**
     * Occurs when this node is being destroyed
     */
    public get destroying(): Observable<SvgNodeDynamicNode>
    {
        return this._destroyingSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(protected _parentGroup: Selection<BaseType, {}, null, undefined>,
                protected _metadata: ɵRelationsMetadata,
                protected _validDropToggle: (dropArea: SvgPeerDropArea) => void,
                protected _createRelation: () => SvgRelationDynamicNode,
                protected _injector: Injector,
                protected _layoutComponent: DesignerLayoutPlaceholderComponent,
                nodeOptions: any)
    {
        this._nodeX = isPresent(this._metadata.x) ? this._metadata.x : 0;
        this._nodeY = isPresent(this._metadata.y) ? this._metadata.y : 0;

        this._properties =
        {
            id: this._metadata.id,
            name: this._metadata.name,
            description: this._metadata.description,
            dynamicNodeInstance: this,
            properties: this._metadata.nodeOptionsMetadata,
            value: transformOptionsToProperties(this._metadata && this._metadata.nodeOptionsMetadata, nodeOptions)
        };

        this._initialize();
    }

    //######################### public methods #########################

    /**
     * Method used for destroying this relation node
     */
    public destroy()
    {
        if(this._metadata && this._metadata.outputs && this._metadata.outputs.length)
        {
            this._metadata.outputs
                .forEach(output => output.relations && output.relations.forEach(relation => relation.destroy()));
        }

        if(this._metadata && this._metadata.inputs && this._metadata.inputs.length)
        {
            this._metadata.inputs
                .forEach(input => input.relations && input.relations.forEach(relation => relation.destroy()));
        }

        if(this._dynamicInputs && this._dynamicInputs.length)
        {
            this._dynamicInputs.forEach(input => input.relations && input.relations.forEach(relation => relation.destroy()));
        }

        this._miscGroup.remove();
        this._miscGroup = null;
        this._nodeGroup.remove();
        this._nodeGroup = null;
        this._inputsGroup.remove();
        this._inputsGroup = null;
        this._dynamicInputsGroup.remove();
        this._dynamicInputsGroup = null;
        this._outputsGroup.remove();
        this._outputsGroup = null;
        this._properties = {};
        this._dynamicInputs = [];
        this._metadata = null;
        this._layoutComponent = null;

        this._destroyingSubject.next(this);
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     */
    public invalidateVisuals(propertyName?: string): void
    {
        if(propertyName == INVALIDATE_PROPERTIES)
        {
            let newDynamicInputs: ɵDynamicRelationsInputMetadata[] = (this._metadata.dynamicInputs && this._metadata.dynamicInputs(this._properties.value)) || [];

            this._dynamicInputs.forEach(input =>
            {
                let found = newDynamicInputs.find(itm => itm.ɵId == input.ɵId);

                if(found)
                {
                    found.relations = input.relations;
                }
                else
                {
                    if(input.relations && input.relations.length)
                    {
                        input.relations.forEach(relation => relation.destroy());
                    }
                }
            });

            this._dynamicInputs = newDynamicInputs;

            this._addDynamicInputs();
        }
    }

    /**
     * Gets real dynamic input id
     * @param inputName Name of input which id will be get
     */
    public getDynamicInputId(inputName: string): string
    {
        let input = this._metadata.inputs.find(itm => itm.id == inputName);

        if(input)
        {
            return input.id;
        }

        return this._dynamicInputs.find(itm => (itm.ɵId || itm.id) == inputName).id;
    }

    /**
     * Gets input coordinates of specified input
     * @param inputName Name of input which coordinates will be get
     * @param dynamic Indication whether is input dynamic
     */
    public getInputCoordinates(inputName: string, dynamic: boolean): Coordinates
    {
        return {
            x: this._nodeX,
            y: this._nodeY + (dynamic ? this._dynamicInputs : this._metadata.inputs).find((itm: ɵDynamicRelationsInputMetadata) => (itm.ɵId || itm.id) == inputName).y
        };
    }

    /**
     * Gets output coordinates of specified output
     * @param outputName Name of output which coordinates will be get
     */
    public getOutputCoordinates(outputName: string): Coordinates
    {
        return {
            x: this._nodeX + nodeWidth,
            y: this._nodeY + this._metadata.outputs.find(itm => itm.id == outputName).y
        };
    }

    /**
     * Adds relation to specified output
     * @param outputName Output name which will register relation
     * @returns Returns relation that will start from this output
     */
    public addOutputRelation(outputName: string): SvgRelationDynamicNode
    {
        let relation = this._createRelation();
        let outputPeer = this._metadata.outputs.find(itm => itm.id == outputName);

        outputPeer.relations = outputPeer.relations || [];

        relation.startDestroyingSubscription = relation.destroying.subscribe(relation =>
        {
            let index = outputPeer.relations.indexOf(relation);

            if(index >= 0)
            {
                outputPeer.relations.splice(index, 1);
            }
        });

        outputPeer.relations.push(relation);

        return relation;
    }

    /**
     * Adds relation to specified input
     * @param relation Relation to be added to specified input
     * @param inputName Input name which will register relation
     * @param dynamic Indication whether is input dynamic
     */
    public addInputRelation(relation: SvgRelationDynamicNode, inputName: string, dynamic: boolean): boolean
    {
        let inputPeer = (dynamic ? this._dynamicInputs : this._metadata.inputs).find((itm: ɵDynamicRelationsInputMetadata) => (itm.ɵId || itm.id) == inputName);

        inputPeer.relations = inputPeer.relations || [];

        //trying to add same relation
        if(inputPeer.relations.length > 0 && relation.start.x == inputPeer.relations[0].start.x && relation.start.y == inputPeer.relations[0].start.y)
        {
            return false;
        }

        //trying to replace existing relation to this input
        if(inputPeer.relations.length > 0)
        {
            inputPeer.relations[0].destroy();
        }

        relation.endDestroyingSubscription = relation.destroying.subscribe(relation =>
        {
            let index = inputPeer.relations.indexOf(relation);

            if(index >= 0)
            {
                inputPeer.relations.splice(index, 1);
            }
        });

        inputPeer.relations.push(relation);

        relation.endPeer = 
        {
            dynamic,
            inputId: inputName,
            svgNode: this
        };

        return true;
    }

    /**
     * Updates all relations position when dragging
     */
    public updateRelations()
    {
        if(this._metadata.inputs)
        {
            this._metadata.inputs.forEach(input =>
            {
                if(input.relations && input.relations.length)
                {
                    input.relations[0].end = this.getInputCoordinates(input.id, false);
                    input.relations[0].invalidateVisuals();
                }
            });
        }

        if(this._metadata.outputs)
        {
            this._metadata.outputs.forEach(output =>
            {
                if(output.relations)
                {
                    output.relations.forEach(relation =>
                    {
                        relation.start = this.getOutputCoordinates(output.id);
                        relation.invalidateVisuals();
                    });
                }
            });
        }

        if(this._dynamicInputs)
        {
            this._dynamicInputs.forEach(input =>
            {
                if(input.relations && input.relations.length)
                {
                    input.relations[0].end = this.getInputCoordinates(input.ɵId, true);
                    input.relations[0].invalidateVisuals();
                }
            });
        }
    }

    //######################### protected methods #########################

    /**
     * Initialize node
     */
    protected _initialize()
    {
        this._nodeGroup = this._parentGroup.append('g')
            .attr('transform', `translate(${this._nodeX}, ${this._nodeY})`);

        this._nodeGroup.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', nodeWidth)
                .attr('height', this._getHeight())
                .attr('fill', '#1e1e1e')
                .attr('stroke', '#d4d4d4')
            .on('click', () =>
            {
                let propertiesSvc = this._injector.get(NODE_PROPERTIES_SERVICE);

                if(propertiesSvc)
                {
                    propertiesSvc.showProperties(this._properties)
                }
            });

        this._miscGroup = this._nodeGroup.append('g');
        this._inputsGroup = this._nodeGroup.append('g');
        this._dynamicInputsGroup = this._nodeGroup.append('g');
        this._outputsGroup = this._nodeGroup.append('g');

        this._renderVisuals();
        this._addInputs();
        this._addOutputs();

        this._nodeGroup.call(drag().on('drag', () =>
        {
            this._nodeX += event.dx;
            this._nodeY += event.dy;

            this._nodeGroup.attr('transform', `translate(${this._nodeX}, ${this._nodeY})`);
            this.updateRelations();
        }));
    }

    /**
     * Renders misc visuals
     */
    protected _renderVisuals()
    {
        this._miscGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', nodeWidth)
            .attr('height', 20)
            .attr('fill', '#569cd6');

        this._miscGroup.append("text")
            .text(this._metadata.name)
                .attr("x", 4)
                .attr("y", 14)
                .attr('fill', '#F8F8F8');

        this._miscGroup.append("text")
            .text("X")
                .attr("x", nodeWidth - 4)
                .attr("y", 14)
                .attr('fill', '#F8F8F8')
                .attr('style', 'cursor: pointer;')
                .attr('text-anchor', 'end')
            .on('click', () =>
            {
                this.destroy();
            });

        this._miscGroup.append("text")
            .text(`ID: ${this._metadata.id}`)
                .attr("x", 8)
                .attr("y", 36)
                .attr('fill', '#F8F8F8');
    }

    /**
     * Adds inputs to this node
     */
    protected _addInputs()
    {
        this._metadata.inputs = this._metadata.inputs || [];
        this._metadata.inputs.forEach((input, index) => input.y = peerOffset + (index * peerStep));

        this._addInputCircles(this._inputsGroup, this._metadata.inputs, false);
    }

    /**
     * Adds dynamic inputs to node
     */
    protected _addDynamicInputs()
    {
        this._dynamicInputs.forEach((input, index) => input.y = (this._metadata.inputs.length ? (this._metadata.inputs[this._metadata.inputs.length - 1].y + peerStep) : peerOffset) + (index * peerStep));
        this._nodeGroup.select('rect')
            .attr('height', this._getHeight());

        this._addInputCircles(this._dynamicInputsGroup, this._dynamicInputs, true);
    }

    /**
     * Adds inputs into their groups and renders them
     * @param group Inputs group to be extended
     * @param inputs Array of inputs to be added
     * @param dynamic Indication whether is input dynamic or not
     */
    protected _addInputCircles(group: Selection<BaseType, {}, null, undefined>, inputs: ɵDynamicRelationsInputMetadata[], dynamic: boolean)
    {
        let relation: SvgRelationDynamicNode;

        let changes = group.selectAll<SVGGeometryElement, ɵDynamicRelationsInputMetadata>('g')
            .data(inputs, datum => datum.ɵId || datum.id)
            .call(sel =>
            {
                sel.select('text')
                    .text(itm => itm.name)
                    .attr('y', itm => itm.y + 4);

                sel.select('circle.action')
                    .datum(d => d)
                    .attr('cy', itm => itm.y);

                let actionCircle = sel.select('circle:not(.action)')
                    .datum(d => d)
                    .attr('cy', itm => itm.y);

                if(!actionCircle.empty())
                {
                    let inMeta = actionCircle.datum();

                    if(inMeta.relations && inMeta.relations.length)
                    {
                        inMeta.relations.forEach(inRelation =>
                        {
                            inRelation.end = this.getInputCoordinates(inMeta.ɵId || inMeta.id, true);

                            inRelation.invalidateVisuals();
                        });
                    }
                }
            });

        changes.exit().remove();

        changes
            .enter()
            .call(sel =>
            {
                let inputGroup = sel.append('g');

                inputGroup.append('circle')
                    .attr('cx', 0)
                    .attr('r', 5)
                    .attr('fill', '#569cd6')
                    .attr('cy', itm => itm.y);

                inputGroup.append('text')
                    .text(itm => itm.name)
                        .attr('x', 10)
                        .attr('y', itm => itm.y + 4)
                        .attr('fill', '#F8F8F8');

                inputGroup.append('circle')
                        .attr('class', 'action')
                        .attr('cx', 0)
                        .attr('r', 10)
                        .attr('fill', 'transparent')
                        .attr('cy', itm => itm.y)
                    .on('mouseenter', (datum, index, groups) =>
                    {
                        select(groups[index])
                            .attr('fill', 'url(#input-hover)');

                        this._validDropToggle(
                        {
                            svgNode: this,
                            inputId: datum.ɵId || datum.id,
                            dynamic: dynamic
                        });
                    })
                    .on('mouseleave', (_datum, index, groups) =>
                    {
                        select(groups[index])
                            .attr('fill', 'transparent');

                        this._validDropToggle(null);
                    })
                    .call(drag<SVGCircleElement, ɵDynamicRelationsInputMetadata>()
                        .on('start', datum =>
                        {
                            relation = datum.relations && datum.relations.length && datum.relations[0];

                            if(!relation)
                            {
                                return;
                            }

                            datum.relations.splice(0, 1);
                        })
                        .on('drag', () =>
                        {
                            if(!relation)
                            {
                                return;
                            }

                            relation.end =
                            {
                                x: event.x + this._nodeX,
                                y: event.y + this._nodeY
                            };

                            relation.invalidateVisuals();
                        })
                        .on('end', () =>
                        {
                            if(!relation)
                            {
                                return;
                            }

                            relation.invalidateVisuals(INVALIDATE_DROP);
                        }));
            });
    }

    /**
     * Adds outputs to this node
     */
    protected _addOutputs()
    {
        let relation: SvgRelationDynamicNode;
        this._metadata.outputs = this._metadata.outputs || [];

        this._metadata.outputs.forEach((output, index) => output.y = peerOffset + (index * peerStep));

        this._outputsGroup.selectAll('circle')
            .data(this._metadata.outputs)
            .enter()
            .call(sel =>
            {
                sel.append('circle')
                    .attr('cx', nodeWidth)
                    .attr('r', 5)
                    .attr('fill', '#e99d2c')
                    .attr('cy', itm => itm.y);

                sel.append('text')
                    .text(itm => itm.name)
                        .attr('x', nodeWidth - 10)
                        .attr('y', itm => itm.y + 4)
                        .attr('text-anchor', 'end')
                        .attr('fill', '#F8F8F8');

                sel.append('circle')
                        .attr('cx', nodeWidth)
                        .attr('r', 10)
                        .attr('fill', 'transparent')
                        .attr('cy', itm => itm.y)
                    .on('mouseenter', (_datum, index, groups) =>
                    {
                        select(groups[index])
                            .attr('fill', 'url(#output-hover)');
                    })
                    .on('mouseleave', (_datum, index, groups) =>
                    {
                        select(groups[index])
                            .attr('fill', 'transparent');
                    })
                    .call(drag<SVGCircleElement, ɵDynamicRelationsInputMetadata>()
                        .on('start', datum =>
                        {
                            datum.relations = datum.relations || [];

                            relation = this._createRelation();

                            relation.startDestroyingSubscription = relation.destroying.subscribe(relation =>
                            {
                                let index = datum.relations.indexOf(relation);

                                if(index >= 0)
                                {
                                    datum.relations.splice(index, 1);
                                }
                            });

                            relation.start = this.getOutputCoordinates(datum.id);

                            datum.relations.push(relation);
                        })
                        .on('drag', () =>
                        {
                            relation.end =
                            {
                                x: event.x + this._nodeX,
                                y: event.y + this._nodeY
                            };

                            relation.invalidateVisuals();
                        })
                        .on('end', () =>
                        {
                            relation.invalidateVisuals(INVALIDATE_DROP);
                            relation = null;
                        }));
            });

    }

    /**
     * Gets metadata for current node
     */
    protected _getMetadata(): Promise<DynamicComponentRelationMetadata>
    {
        let nodeOptions = transformPropertiesToOptions(this._properties && this._properties.properties, this._properties && this._properties.value);

        if(this._metadata.normalizeOptions)
        {
            nodeOptions = this._metadata.normalizeOptions(nodeOptions);
        }

        return Promise.resolve(
        {
            id: this._metadata.id,
            nodeOptions: nodeOptions,
            nodeType: this._metadata.nodeType,
            outputs: this._getOutputs()
        });
    }

    /**
     * Gets current height
     */
    protected _getHeight(): number
    {
        let height = peerOffset + 30;

        if(this._metadata.inputs && this._metadata.inputs.length)
        {
            height += (this._metadata.inputs.length * peerStep);
        }

        if(this._dynamicInputs && this._dynamicInputs.length)
        {
            height += (this._dynamicInputs.length * peerStep);
        }

        return Math.max(minHeight, height);
    }

    /**
     * Gets metadata for outputs of component
     */
    protected _getOutputs(): DynamicComponentRelationOutputMetadata[]
    {
        let result: DynamicComponentRelationOutputMetadata[] = [];

        if(this._metadata && this._metadata.outputs && this._metadata.outputs.length)
        {
            this._metadata.outputs.forEach(output =>
            {
                if(!output.id || !output.relations || !output.relations.length)
                {
                    return;
                }

                let inputs: DynamicComponentRelationInputMetadata[] = [];

                output.relations.forEach(relation =>
                {
                    inputs.push(
                    {
                        id: relation.endPeer.svgNode.id,
                        inputName: relation.endPeer.svgNode.getDynamicInputId(relation.endPeer.inputId)
                    });
                });

                result.push(
                {
                    outputName: output.id,
                    inputs: inputs
                });
            });
        }

        return result;
    }
}