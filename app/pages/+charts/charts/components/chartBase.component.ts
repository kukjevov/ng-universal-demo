import {Directive, ElementRef, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter} from '@angular/core';
import {nameof, isPresent} from '@jscrpt/common';
import {BaseType, ScaleBand, ScaleLinear, scaleBand, select, Selection, scaleLinear, Axis, axisBottom, axisLeft, format, max} from 'd3';
import * as moment from 'moment';

import {ChartItem, ChartItemTooltip} from '../charts.interface';

/**
 * Base class for displaying charts
 */
@Directive()
export abstract class ChartBaseComponent implements OnInit, OnChanges
{
    //######################### protected fields #########################

    /**
     * Objects stored for created chart
     */
    protected _chart:
    {
        margin?: {top: number, right: number, bottom: number, left: number},
        width?: number,
        height?: number;
        xAxis?: Axis<string>,
        yAxis?: Axis<number | {valueOf(): number}>,
        chartG?: Selection<BaseType, {}, null, undefined>,
        othersG?: Selection<BaseType, {}, null, undefined>,
        xAxisG?: Selection<BaseType, {}, null, undefined>,
        yAxisG?: Selection<BaseType, {}, null, undefined>,
        xScale?: ScaleBand<string>,
        yScale?: ScaleLinear<number, number>
    } = {};

    //######################### public properties - inputs #########################

    /**
     * Data to be displayed
     */
    @Input()
    public data: ChartItem[] = [];

    /**
     * Height of chart
     */
    @Input()
    public height: number;

    /**
     * Value text to be displayed in tooltip or legend
     */
    @Input()
    public valueText: string;

    /**
     * Description of Y values
     */
    @Input()
    public yValuesText: string;

    //######################### public properties - outputs #########################

    /**
     * Occurs when there is need for displaying tooltip
     */
    @Output()
    public showTooltip: EventEmitter<ChartItemTooltip> = new EventEmitter<ChartItemTooltip>();

    /**
     * Occurs when there is need for hiding tooltip
     */
    @Output()
    public hideTooltip: EventEmitter<void> = new EventEmitter<void>();

    //######################### constructor #########################
    constructor(protected _element: ElementRef<HTMLElement>)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._initChart();
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<ChartBaseComponent>('data') in changes && this.data)
        {
            if(!this._chart.chartG)
            {
                this._initChart();
            }

            this._chart.xAxis = axisBottom(this._chart.xScale)
                .ticks(14)
                .tickFormat(d =>
                {
                    let date: moment.Moment;

                    if(isPresent(d))
                    {
                        date = moment(d);
                    
                        if(!date.isValid)
                        {
                            date = null;
                        }
                    }

                    return date?.format('MMM DD');
                });

            this._chart.yAxis = axisLeft(this._chart.yScale)
                .tickSize(this._chart.width)
                .ticks(4)
                .tickFormat(d => format('~s')(d));

            let maxVal = max(this.data.map(itm => itm.cases));

            this._chart.yScale = this._chart.yScale.domain([0, maxVal + Math.round(maxVal * 0.2)]);

            this._chart.yAxisG.call(this._chart.yAxis)
                .attr("transform", `translate(${this._chart.width}, 0)`)
                .selectAll("path").remove();
                
            this._chart.xAxisG
                .call(this._chart.xAxis)
                .selectAll("text")
                    .style("text-anchor", "end")
                    .style('font-size', '1.2em')
                    .attr("dx", "-.3em")
                    .attr("dy", ".3em")
                    .attr("transform", "rotate(-40)" )
            
            this._chart.xAxisG
                .selectAll("path").remove();

            this._chart.xAxisG
                .selectAll("line").remove();

            this._processData();
        }
    }

    //######################### private methods #########################

    /**
     * Initialize chart
     */
    private _initChart()
    {
        if(this._chart.chartG)
        {
            return;
        }

        this._chart.margin = {top: 16, right: 10, bottom: 76, left: 40};

        let selfObj = select(this._element.nativeElement),
            svgWidth = (+selfObj.property("offsetWidth")),
            svg = selfObj.append("svg")
                .attr("viewBox", `0 0 ${svgWidth} ${this.height}`);

        this._chart.height = this.height - this._chart.margin.top - this._chart.margin.bottom;
        this._chart.width = svgWidth - this._chart.margin.left - this._chart.margin.right;

        this._chart.chartG = svg.append("g").attr("transform", "translate(" + this._chart.margin.left + "," + this._chart.margin.top + ")");
        this._chart.othersG = svg.append("g");

        //mierky pre ziskanie suradnic
        this._chart.xScale = scaleBand()
            .range([0, this._chart.width])
            .domain(this.data.map(itm => itm.date))
            .padding(0.6);

        this._chart.yScale = scaleLinear()
            .range([this._chart.height, 0]);

        //skupiny pre obe osi
        this._chart.xAxisG = this._chart.chartG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this._chart.height + ")");

        this._chart.yAxisG = this._chart.chartG.append("g")
            .attr("class", "y axis");

        //legend
        let legendG = this._chart.othersG
            .append('g')
                .attr('transform', `translate(${this._chart.margin.left + (this._chart.width / 2)}, ${this._chart.height + this._chart.margin.top + 56})`);
                
        let rect = legendG.append('text')
            .text(this.valueText)
            .attr('x', 0)
            .attr('y', 0)
            .style('text-anchor', 'middle')
            .style('font-size', '0.85em')
            .node()
            .getBBox();

        legendG.append('circle')
            .attr('cx', rect.x - 10)
            .attr('cy', -5)
            .attr('r', 5)
            .attr('class', 'item-color legend');

        this._chart.othersG
            .append('g')
                .attr('transform', `translate(0, ${this._chart.margin.top + (this._chart.height / 2)})`)
            .append('text')
                .attr('x', 0)
                .attr('y', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '0.8em')
                .attr("transform", "rotate(-90)" )
                .text(this.yValuesText);
    }

    /**
     * Method called for data processing and creating rest of chart from it
     */
    protected abstract _processData();
}