import {Component, ChangeDetectionStrategy} from "@angular/core";
import {line, curveMonotoneX} from 'd3';

import {ChartBaseComponent} from '../chartBase.component';
import {ChartItem} from '../../charts.interface';

/**
 * Line chart for displaying data
 */
@Component(
{
    selector: 'line-chart',
    template: '',
    styleUrls: ['lineChart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent extends ChartBaseComponent
{
    //######################### protected methods #########################
    
    /**
     * Method called for data processing and creating rest of chart from it
     */
    protected _processData()
    {
        let lineGenerator = line<ChartItem>()
            .x(d => this._chart.xScale(d.date))
            .y(d => this._chart.yScale(d.cases))
            .curve(curveMonotoneX);

        let chartG = this._chart.chartG
            .append('g')
                .attr('transform', `translate(18, 0)`);

        chartG.append("path")
            .datum(this.data)
            .attr("class", "line item-color")
            .attr("d", lineGenerator);

        chartG.selectAll(".dot.item-color")
            .data(this.data)
            .enter()
            .append("circle")
                .attr("class", "dot item-color")
                .attr("cx", d => this._chart.xScale(d.date))
                .attr("cy", d => this._chart.yScale(d.cases))
                .attr("r", 4)
            .on('mouseenter', data =>
            {
                let e = event as MouseEvent;
                let target = e.target as SVGRectElement;
                let rect = target.getBoundingClientRect();

                this.showTooltip.emit(
                {
                    value: data,
                    x: rect.left + (rect.width / 2),
                    y: rect.top,
                    visible: true
                });
            })
            .on('mouseleave', () =>
            {
                this.hideTooltip.emit();
            });
    }
}