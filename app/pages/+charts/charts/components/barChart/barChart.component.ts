import {Component, ChangeDetectionStrategy} from "@angular/core";

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
        this._chart.chartG.selectAll(".bar")
            .data(this.data)
            .enter()
            .append("rect")
                .attr("class", "bar")
                .attr("x", d => this._chart.xScale(d.date))
                .attr("width", this._chart.xScale.bandwidth())
                .attr("y", d => this._chart.yScale(d.cases))
                .attr("height", d => this._chart.height - this._chart.yScale(d.cases));
    }
}