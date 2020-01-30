import {Component, ChangeDetectionStrategy, Input, ElementRef, EventEmitter, Output} from "@angular/core";
import {isBlank} from "@jscrpt/common";
import {select, Selection, BaseType, scaleBand, scaleLinear, scaleOrdinal, stack, max, axisBottom, axisLeft, ScaleBand, ScaleLinear, ScaleOrdinal, Line, line, Series, local} from 'd3';
import * as numeral from 'numeral';

import {MosiaChartData, MosiaChartValue, HodnotenieService, ChartRequest, MetadataService, HodnotenieMetadataDescription} from "../../../../services/api/hodnotenie";

interface ChartValue
{
    x: number;
    y: number;
}

var offset = local();
var thisGlobal = local<ChartComponent>();

/**
 * Component used for rendering chart for osetrovacia doba
 */
@Component(
{
    selector: "[mosiaChart]",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent
{
    //######################### private fields #########################

    /**
     * Indication whether chart was initialized
     */
    private _initialized: boolean = false;

    /**
     * Data for displaying chart
     */
    private _data: MosiaChartData;

    /**
     * Metadata
     */
    private _metadata: HodnotenieMetadataDescription[];

    /**
     * Objects stored for created chart
     */
    private _chart:
    {
        parentGroup?: Selection<BaseType, {}, null, undefined>,
        legendGroup?: Selection<BaseType, {}, null, undefined>,
        width?: number,
        height?: number,
        lineGenerator?: Line<ChartValue>,
        lineG?: Selection<BaseType, {}, null, undefined>,
        circleG?: Selection<BaseType, {}, null, undefined>,
        barChartG?: Selection<BaseType, {}, null, undefined>,
        xAxisG?: Selection<BaseType, {}, null, undefined>,
        yAxisG?: Selection<BaseType, {}, null, undefined>,
        xScale?: ScaleBand<string>,
        yScale?: ScaleLinear<number, number>
    } = {};

    //######################### public properties - inputs #########################

    /**
     * Data for displaying chart
     */
    @Input("mosiaChart")
    public set request(value: {request: ChartRequest, id: string})
    {
        if(!value)
        {
            return;
        }

        let dataPromise = this._hodnotenieSvc
            .getChart(value.id,
                      value.request)
            .toPromise();

        Promise.all([dataPromise, this._metadataSvc.metadata])
            .then(data =>
            {
                this._data = data[0];
                this._metadata = data[1].pravaStrana;

                let key = this._data.legendaRiadokKluc.split('_');
                let title = this._getTextForKey(key.slice(0, 1), this._metadata);
                title += `, ${this._getTextForKey(key.slice(1, 2), this._metadata.find(itm => itm.nazov == key[0]).children)}`;
                title += `, ${this._getTextForKey(key, this._metadata)}`;
                title += `, ${this._getTextForCol(this._data.legendaAtribut)}`;

                this.titleChanged.emit(title);

                this._initChart();
            });
    }

    /**
     * Height of chart
     */
    @Input()
    public height: number = 300;

    //######################### public methods - outputs #########################

    /**
     * Occurs when title for chart has changed
     */
    @Output()
    public titleChanged: EventEmitter<string> = new EventEmitter<string>();

    //######################### constructor #########################
    constructor(private element: ElementRef,
                private _hodnotenieSvc: HodnotenieService,
                private _metadataSvc: MetadataService)
    {
    }

    //######################### private methods #########################

    /**
     * Inits data into chart
     */
    private _initChart()
    {
        if(isBlank(this._data) || isBlank(this._data.stlpce) ||
           isBlank(this._data.obdobia) || this._data.obdobia.length < 1)
        {
            return;
        }

        //Creating SVG
        if(!this._initialized)
        {
            let selfObj = select(this.element.nativeElement),
                margin = {top: 16, right: 10, bottom: 60, left: 40},
                svgWidth = (+selfObj.property("offsetWidth")),
                svgHeight = this.height,
                svg = selfObj.append("svg")
                            .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

            this._chart.parentGroup = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            this._chart.legendGroup = svg.append('g').attr("transform", `translate(${margin.left},${svgHeight - margin.bottom + 16})`);
            this._chart.width = svgWidth - margin.left - margin.right;
            this._chart.height = svgHeight - margin.top - margin.bottom;

            this._chart.xScale = scaleBand<string>()
                .rangeRound([0, this._chart.width])
                .paddingOuter(0.2)
                .paddingInner(0.5);

            this._chart.yScale = scaleLinear()
                .rangeRound([this._chart.height, 0]);

            this._chart.lineGenerator = line<ChartValue>()
                .x(d => this._chart.xScale(this._data.obdobia[d.x]) + (this._chart.xScale.bandwidth() / 2))
                .y(d => this._chart.yScale(d.y));

            this._chart.barChartG = this._chart.parentGroup.append("g");
            this._chart.lineG = this._chart.parentGroup.append('g');
            this._chart.circleG = this._chart.parentGroup.append('g');

            this._chart.xAxisG = this._chart.parentGroup.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + this._chart.height + ")");

            this._chart.yAxisG = this._chart.parentGroup.append("g")
                .attr("class", "axis");

            this._initialized = true;
        }

        let maxVal = 0;
        let transformedData = [];
        let barValues = this._data.stlpce;
        let refValues = this._data.reference;
        let $this = this;

        for(let x = 0; x < this._data.obdobia.length; x++)
        {
            let obj = {};
            let sumValue = 0;
            transformedData.push(obj);
            obj['month'] = this._data.obdobia[x];

            for(let y = 0; y < barValues.length; y++)
            {
                obj[barValues[y].legendaKluc] = barValues[y].hodnoty[x];
                sumValue += barValues[y].hodnoty[x];
            }

            maxVal = Math.max(maxVal, sumValue);
        }

        if(refValues)
        {
            maxVal = Math.max(maxVal, max(refValues.hodnoty));
        }

        let keys = barValues.map(itm => itm.legendaKluc);

        let z = scaleOrdinal()
            .range(barValues.map(itm => itm.farba));

        this._chart.xScale.domain(this._data.obdobia);
        this._chart.yScale.domain([0, maxVal]);
        z.domain(keys);

        if(!this._chart.barChartG.selectAll('g').empty())
        {
            let barChartGroups = this._chart.barChartG
                .selectAll("g");

            barChartGroups.selectAll("rect")
                .transition()
                .duration(850)
                    .attr("y", d => this._chart.yScale(0))
                    .attr("height", 0)
                .on('end', () =>
                {
                    barChartGroups.remove();
                    this._renderBarChart(z, keys, transformedData);
                });
        }
        else
        {
            this._renderBarChart(z, keys, transformedData);
        }

        if(!refValues)
        {
            this._chart.lineG.select('path')
                .transition()
                .duration(850)
                    .attr("opacity", 0)
                .on('end', () =>
                {
                    this._chart.lineG.select('path').remove();
                });

            this._chart.circleG.selectAll('circle')
                .transition()
                .duration(850)
                    .attr("r", 0)
                .on('end', () =>
                {
                    this._chart.circleG.selectAll('circle').remove();
                });
        }
        else
        {
            let line = this._chart.lineG.select('path');
            let startDuration = 850;

            if(line.empty())
            {
                line = this._chart.lineG.append('path');
                startDuration = 0;
            }

            let data = refValues.hodnoty.map((itm, index) => {return {x: index, y: itm}});

            line.datum(data)
                .transition()
                .duration(startDuration)
                    .attr("opacity", 0)
                    .attr("class", `line-thick`)
                    .attr("stroke", refValues.farba)
                    .attr("d", this._chart.lineGenerator)
                .transition()
                .duration(850)
                    .attr("opacity", 1);

            let circleDuration = 1400;
            let circles = this._chart.circleG.selectAll<SVGCircleElement, ChartValue>('circle')
                .data(data);

            if(circles.empty())
            {
                circleDuration = 850;
            }

            let tooltip;

            circles.enter().append('circle')
                .on("mouseenter", function(data)
                {
                    let box = (<SVGCircleElement>this).getBBox();

                    tooltip = $this._chart.parentGroup.append("text")
                        .text(numeral((data as any).y).format('0,0.00'))
                        .attr("x", box.x + 3)
                        .attr("y", box.y - 3);
                })
                .on("mouseleave", function()
                {
                    tooltip.remove();
                })
                    .attr("class", "dot-thin")
                    .attr("r", 0)
                    .attr('cx', itm => this._chart.xScale(this._data.obdobia[itm.x]) + (this._chart.xScale.bandwidth() / 2))
                    .attr('cy', itm => this._chart.yScale(itm.y))
                .merge(circles)
                .transition()
                .duration(circleDuration)
                    .attr('fill', itm => refValues.farba)
                    .attr('cx', itm => this._chart.xScale(this._data.obdobia[itm.x]) + (this._chart.xScale.bandwidth() / 2))
                    .attr('cy', itm => this._chart.yScale(itm.y))
                    .attr("r", 3.5);
        }
        
        this._chart.xAxisG.call(axisBottom(this._chart.xScale));
        this._chart.yAxisG.call(axisLeft(this._chart.yScale).ticks(null));

        let allData = [...this._data.stlpce];

        if(this._data.reference)
        {
            this._data.reference.reference = true;
            allData.push(this._data.reference);
        }

        let legends = this._chart.legendGroup.selectAll<SVGGElement, MosiaChartValue>('g')
            .data(allData);

        legends.enter().append('g')
            .merge(legends)
            .each(function() {offset.set(this as Element, $this._chart.width / (allData.length))})
            .each(function() {thisGlobal.set(this as Element, $this)})
            .each(this._renderLegend);

        legends.exit().remove();
    }

    /**
     * Renders bar chart
     */
    private _renderBarChart(z: ScaleOrdinal<string, {}>, keys: string[], transformedData: any[])
    {
        let tooltip;
        let $this = this;

        this._chart.barChartG
            .selectAll("g")
            .data(this._addValue(stack().keys(keys)(transformedData), keys))
            .enter().append("g")
                .attr("fill", <any>(d => z(d.key)))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            .on("mouseenter", function(data)
            {
                let box = (<SVGRectElement>this).getBBox();

                tooltip = $this._chart.parentGroup.append("text")
                    .text(numeral((data as any).value).format('0,0.00'))
                    .attr("x", box.x + 3)
                    .attr("y", box.y - 3);
            })
            .on("mouseleave", function()
            {
                tooltip.remove();
            })
                .attr("x", d => this._chart.xScale(<any>d.data.month))
                .attr("y", d => this._chart.yScale(0))
                .attr("width", this._chart.xScale.bandwidth())
            .transition()
            .duration(850)
                .attr("y", d => this._chart.yScale(d[1]))
                .attr("height", d => this._chart.yScale(d[0]) - this._chart.yScale(d[1]));
    }

    /**
     * Adds value to array of coordinates
     */
    private _addValue(values: Series<{[key: string]: number}, string>[], keys: string[]): Series<{[key: string]: number}, string>[]
    {
        for(let x = 0; x < values.length; x++)
        {
            for(let y = 0; y < values[x].length; y++)
            {
                values[x][y]['value'] = values[x][y].data[keys[x]];
            }
        }

        return values;
    }

    /**
     * Renders legend item
     */
    private _renderLegend(this: BaseType, data: MosiaChartValue, index: number)
    {
        let $this = select(this);
        let text = $this.select('text');
        let off = (offset.get(this as Element)) as number * index;
        let $thisGlobal = (thisGlobal.get(this as Element));

        if(text.empty())
        {
            text = $this.append('text');
        }

        text.text(data.reference ? "Referencia" : $thisGlobal._getTextForKey(data.legendaKluc.split('_'), $thisGlobal._metadata))
            .attr("class", "legend-text")
            .attr("y", 20)
            .attr("x", off + 20);

        if(data.reference)
        {
            $this.select('rect').remove();

            let line = $this.select('line');

            if(line.empty())
            {
                line = $this.append('line');
            }

            line.attr('class', 'line-thick')
                .attr('stroke', data.farba)
                .attr('x1', off - 10)
                .attr('y1', 16)
                .attr('x2', off + 15)
                .attr('y2', 16);
        }
        else
        {
            $this.select('line').remove();
            let rect = $this.select('rect');

            if(rect.empty())
            {
                rect = $this.append('rect');
            }

            rect.attr('fill', data.farba)
                .attr("x", off)
                .attr("y", 10)
                .attr("width", 18)
                .attr("height", 10);
        }
    }

    /**
     * Gets description for key
     * @param key Key split to array
     * @param metadata Metadata
     */
    private _getTextForKey(key: string[], metadata: HodnotenieMetadataDescription[])
    {
        if(key.length == 2)
        {
            if(key[1] == "SPOLU" || key[1] === "")
            {
                return metadata.find(itm => itm.nazov == key[0]).popis;
            }
            else
            {
                return metadata.find(itm => itm.nazov == key[0]).children.find(itm => itm.nazov == key[1]).popis;
            }
        }

        if(key.length == 1)
        {
            return metadata.find(itm => itm.nazov == key[0]).popis;
        }

        return this._getTextForKey(key.slice(1), metadata.find(itm => itm.nazov == key[0]).children);
    }

    /**
     * Gets text describing column
     * @param key Key identifying column
     */
    private _getTextForCol(key: string)
    {
        switch(key)
        {
            case 'pacientiUrc':
            {
                return 'Ošetrení pacienti';
            }
            case 'udalostiUrc':
            {
                return 'Udalosti';
            }
            case 'nakladyUrc':
            {
                return 'Náklady';
            }
            default:
            {
                return '';
            }
        }
    }
}