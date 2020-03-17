import {Component, ChangeDetectionStrategy} from "@angular/core";

import {ChartBaseComponent} from '../chartBase.component';

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
    }
}