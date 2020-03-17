import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

import {ChartItem, ChartItemTooltip} from '../../charts.interface';

/**
 * Component used for displaying charts
 */
@Component(
{
    selector: 'chart',
    templateUrl: 'chart.component.html',
    styleUrls: ['chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Tooltip that is being displayed
     */
    public tooltip?: ChartItemTooltip;

    //######################### public properties - inputs #########################

    /**
     * Indication whether display line chart or default bar chart
     */
    @Input()
    public isLineChart: boolean = false;

    /**
     * Height of chart
     */
    @Input()
    public height: number = 400;

    /**
     * Data to be displayed
     */
    @Input()
    public data: ChartItem[] = [];

    /**
     * Value text to be displayed in tooltip or legend
     */
    @Input()
    public valueText: string;
}