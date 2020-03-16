import {Component, ChangeDetectionStrategy} from "@angular/core";

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
export class LineChartComponent
{
    //######################### protected methods #########################
    
    /**
     * Method called for data processing and creating rest of chart from it
     */
    protected _processData()
    {

    }
}