import {Component, ChangeDetectionStrategy, Input, ElementRef, SimpleChanges, OnChanges, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {nameof} from '@jscrpt/common';
import {Axis, Selection, BaseType, ScaleLinear, select, scaleLinear, axisBottom, axisLeft, min, max, event} from 'd3';

import {KrvnyTlak} from '../../interfaces';

/**
 * Reference values
 */
const refValues: [number, number, string][] =
[
    [90, 60, "Nízky krvný tlak"],
    [120, 80, "Ideálny krvný tlak"],
    [140, 90, "Zvýšený krvný tlak"],
    [190, 100, "Vysoký krvný tlak"]
]

/**
 * Component used for displaying blood pressure chart
 */
@Component(
{
    selector: 'div.krvny-tlak-graf',
    template: '',
    styleUrls: ['krvnyTlakGraf.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KrvnyTlakGrafComponent implements OnChanges
{
    //######################### private fields #########################

    /**
     * Objects stored for created chart
     */
    private _chart:
    {
        margin?: {top: number, right: number, bottom: number, left: number},
        width?: number,
        height?: number;
        xAxis?: Axis<number | {valueOf(): number}>,
        yAxis?: Axis<number | {valueOf(): number}>,
        chartG?: Selection<BaseType, {}, null, undefined>,
        othersG?: Selection<BaseType, {}, null, undefined>,
        xAxisG?: Selection<BaseType, {}, null, undefined>,
        yAxisG?: Selection<BaseType, {}, null, undefined>,
        xScale?: ScaleLinear<number, number>,
        yScale?: ScaleLinear<number, number>,
        value?: Selection<SVGRectElement, unknown, null, undefined>,
        refValues?: Selection<SVGRectElement, unknown, null, undefined>[]
    } = {refValues: []};

    /**
     * Value of blood pressure 'systolicky'
     */
    private _sys: number;

    /**
     * Value of blood pressure 'diastolicky'
     */
    private _dia: number;

    /**
     * Element that is used for displaying tooltip
     */
    private _tooltipElement: HTMLDivElement;

    //######################### public properties - inputs #########################

    /**
     * Value of 'krvny tlak' that is displayed
     */
    @Input()
    public value: KrvnyTlak;

    /**
     * Height of chart
     */
    @Input()
    public height: number;

    //######################### constructor #########################
    constructor(private _element: ElementRef<HTMLElement>,
                @Inject(DOCUMENT) private _document: HTMLDocument)
    {
        this._tooltipElement = this._document.createElement('div');
        this._tooltipElement.className = "krvny-tlak-tooltip";
        this._tooltipElement.style.display = 'none';
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<KrvnyTlakGrafComponent>('value') in changes && this.value)
        {
            let [sys, dia] = this.value?.value?.split('/');

            this._sys = +sys;
            this._dia = +dia;

            this._initChart();

            this._processData();
        }
    }

    //######################### private methods #########################
    
    /**
     * Initialize charts
     */
    private _initChart()
    {
        if(this._chart.chartG)
        {
            return;
        }

        this._chart.margin = {top: 16, right: 10, bottom: 50, left: 40};

        let selfObj = select(this._element.nativeElement),
            svgWidth = (+selfObj.property("offsetWidth")),
            svg = selfObj.append("svg")
                .attr("viewBox", `0 0 ${svgWidth} ${this.height}`);

        this._element.nativeElement.append(this._tooltipElement);

        this._chart.height = this.height - this._chart.margin.top - this._chart.margin.bottom;
        this._chart.width = svgWidth - this._chart.margin.left - this._chart.margin.right;

        this._chart.chartG = svg.append("g").attr("transform", "translate(" + this._chart.margin.left + "," + this._chart.margin.top + ")");
        this._chart.othersG = svg.append("g");

        //mierky pre ziskanie suradnic
        this._chart.xScale = scaleLinear()
            .range([0, this._chart.width]);

        this._chart.yScale = scaleLinear()
            .range([this._chart.height, 0]);

        //skupiny pre obe osi
        this._chart.xAxisG = this._chart.chartG.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this._chart.height + ")");

        this._chart.yAxisG = this._chart.chartG.append("g")
            .attr("class", "y axis");

        //legend x
        this._chart.othersG
            .append('g')
                .attr('transform', `translate(${this._chart.margin.left + (this._chart.width / 2)}, ${this._chart.height + this._chart.margin.top + 46})`)
            .append('text')
                .text('Tlak krvi - diastolický (mmHg)')
                .attr('x', 0)
                .attr('y', 0)
                .style('text-anchor', 'middle')
                .style('font-size', '0.85em')
                
        //legend y
        this._chart.othersG
            .append('g')
                .attr('transform', `translate(0, ${this._chart.margin.top + (this._chart.height / 2)})`)
            .append('text')
                .attr('x', 0)
                .attr('y', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '0.8em')
                .attr("transform", "rotate(-90)" )
                .text('Tlak krvi - systolický (mmHg)');

        //create ref values
        this._chart.refValues.push(this._chart.chartG.append("rect")
                                       .attr('class', 'reference-value'));
        this._chart.refValues.push(this._chart.chartG.append("rect")
                                       .attr('class', 'reference-value'));
        this._chart.refValues.push(this._chart.chartG.append("rect")
                                       .attr('class', 'reference-value'));
        this._chart.refValues.push(this._chart.chartG.append("rect")
                                       .attr('class', 'reference-value'));

        //create current value
        this._chart.value = this._chart.chartG.append("rect")
            .attr('class', 'current-value');
    }

    /**
     * Process data from input and renders chart
     */
    private _processData()
    {
        this._chart.xAxis = axisBottom(this._chart.xScale)
                .ticks(15);

        this._chart.yAxis = axisLeft(this._chart.yScale)
            .tickSize(this._chart.width)    
            .ticks(15);

        let sysMin = min([70, this._sys - 10]);
        let diaMin = min([40, this._dia - 10]);

        this._chart.yScale = this._chart.yScale.domain([sysMin, max([190, this._sys + 10])]);
        this._chart.xScale = this._chart.xScale.domain([diaMin, max([100, this._dia + 10])]);

        this._chart.yAxisG.call(this._chart.yAxis)
            .attr("transform", `translate(${this._chart.width}, 0)`)
            .selectAll("path").remove();
            
        this._chart.xAxisG
            .call(this._chart.xAxis);
        
        this._chart.xAxisG
            .selectAll("path").remove();

        this._chart.xAxisG
            .selectAll("line").remove();

        refValues.forEach(([sys, dia], index) =>
        {
            this._renderValue(this._chart.refValues[index], sys, dia, sysMin, diaMin);
        });
        
        this._renderValue(this._chart.value, this._sys, this._dia, sysMin, diaMin);

        this._chart.chartG.append('circle')
            .on('mouseenter', () =>
            {
                let e = event as MouseEvent;
                let target = e.target as SVGRectElement;
                let rect = target.getBBox();

                this._tooltipElement.style.display = 'block';
                this._tooltipElement.style.top = `${rect.y - 14}px`;
                this._tooltipElement.style.left = `${rect.x}px`;

                this._tooltipElement.innerText = `${this._sys}/${this._dia}`;
            })
            .on('mouseleave', () =>
            {
                this._tooltipElement.style.display = 'none';
            })
                .attr('class', 'current-value')
                .attr('cx', this._chart.xScale(diaMin))
                .attr('cy', this._chart.yScale(sysMin))
                .attr('r', 4)
            .transition()
            .duration(500)
                .attr('cx', this._chart.xScale(this._dia))
                .attr('cy', this._chart.yScale(this._sys));

        refValues.forEach(([sys, _dia, text]) =>
        {
            this._chart.chartG.append('text')
                .text(text)
                .attr("transform", `translate(0, 15)`)
                .attr('x', this._chart.xScale(diaMin) + 10)
                .attr('y', this._chart.yScale(sys))
                .style('font-size', '0.85em');
        });
    }

    /**
     * Sets data for displaying blood pressure value
     * @param rect Rectangle to be updated
     * @param sys Value of blood pressure 'systolicky'
     * @param dia Value of blood pressure 'diastolicky'
     * @param sysMin Value of minimal 'systolicky' axis
     * @param diaMin Value of minimal 'diastolicky' axis
     */
    private _renderValue(rect: Selection<SVGRectElement, unknown, null, undefined>,
                         sys: number,
                         dia: number,
                         sysMin: number,
                         diaMin: number)
    {
        let width = this._chart.xScale(dia);
        let height = this._chart.yScale(sysMin) - this._chart.yScale(sys);

            rect.attr('x', this._chart.xScale(diaMin))
                .attr('y', this._chart.yScale(sysMin))
                .attr('width', 0)
                .attr('height', 0)
                .style('stroke-dasharray', width + height)
                .transition()
                .duration(500)
                .attr('y', this._chart.yScale(sys))
                .attr('width', width)
                .attr('height', height);
    } 
}