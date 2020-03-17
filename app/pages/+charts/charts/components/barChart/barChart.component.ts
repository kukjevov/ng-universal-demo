import {Component, ChangeDetectionStrategy} from "@angular/core";
import {event} from 'd3';

import {ChartBaseComponent} from '../chartBase.component';

/**
 * Bar chart for displaying data
 */
@Component(
{
    selector: 'bar-chart',
    template: '',
    styleUrls: ['barChart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent extends ChartBaseComponent
{
    //######################### protected methods #########################
    
    /**
     * Method called for data processing and creating rest of chart from it
     */
    protected _processData()
    {
        this._chart.chartG
            .selectAll(".item-color.bar")
            .data(this.data)
            .enter()
            .append("rect")
                .attr("class", "item-color bar")
                .attr("x", d => this._chart.xScale(d.date))
                .attr("width", this._chart.xScale.bandwidth())
                .attr("y", d => this._chart.yScale(d.cases))
                .attr("height", d => this._chart.height - this._chart.yScale(d.cases))
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