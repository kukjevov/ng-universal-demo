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
            .datum(this.data.map(itm => 
            {
                return {
                    date: itm.date,
                    cases: 0
                };
            }))
            .attr("class", "line item-color")
            .attr("d", lineGenerator)
            .datum(this.data)
            .transition()
            .duration(850)
                .attr("d", lineGenerator);

        chartG.selectAll(".value-hover")
            .data(this.data)
            .enter()
                .call(sel =>
                {
                    sel.append("circle")
                        .attr("class", "dot item-color")
                        .attr("cx", d => this._chart.xScale(d.date))
                        .attr("cy", () => this._chart.yScale(0))
                        .attr("r", 4)
                        .transition()
                        .duration(850)
                            .attr("cy", d => this._chart.yScale(d.cases));

                    sel.append("rect")
                        .attr("class", "value-hover")
                        .attr("x", d => this._chart.xScale(d.date) - (this._chart.xScale.bandwidth() / 2))
                        .attr("width", this._chart.xScale.bandwidth())
                        .attr("y", 0)
                        .attr("height", d => this._chart.height)
                        .style('fill-opacity', 0)
                        .on('mouseenter', (data, index) =>
                        {
                            let target = sel.selectAll('circle').nodes()[index] as SVGCircleElement;
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
                });
    }
}