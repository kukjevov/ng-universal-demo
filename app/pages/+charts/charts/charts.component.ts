import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {ComponentRoute} from "@anglr/common/router";

import {ChartItem} from './charts.interface';

/**
 * Charts sample page
 */
@Component(
{
    selector: 'charts-view',
    templateUrl: 'charts.component.html',
    styleUrls: ['charts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: ''})
export class ChartsComponent implements OnInit
{
    //######################### public properties - template bindings #########################

    /**
     * Data for bar chart
     */
    public barChartData: ChartItem[] = [];

    /**
     * Data for line chart
     */
    public lineChartData: ChartItem[] = [];

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.barChartData =
        [
            {
                date: '2020-03-06',
                cases: 1
            },
            {
                date: '2020-03-07',
                cases: 2
            },
            {
                date: '2020-03-08',
                cases: 2
            },
            {
                date: '2020-03-09',
                cases: 2
            },
            {
                date: '2020-03-10',
                cases: 0
            },
            {
                date: '2020-03-11',
                cases: 3
            },
            {
                date: '2020-03-12',
                cases: 11
            },
            {
                date: '2020-03-13',
                cases: 11
            },
            {
                date: '2020-03-14',
                cases: 12
            },
            {
                date: '2020-03-15',
                cases: 17
            },
            {
                date: '2020-03-16',
                cases: 11
            },
            {
                date: '2020-03-17',
                cases: 12
            }
        ];

        this.lineChartData =
        [
            {
                date: '2020-03-06',
                cases: 1
            },
            {
                date: '2020-03-07',
                cases: 3
            },
            {
                date: '2020-03-08',
                cases: 5
            },
            {
                date: '2020-03-09',
                cases: 7
            },
            {
                date: '2020-03-10',
                cases: 7
            },
            {
                date: '2020-03-11',
                cases: 10
            },
            {
                date: '2020-03-12',
                cases: 21
            },
            {
                date: '2020-03-13',
                cases: 32
            },
            {
                date: '2020-03-14',
                cases: 44
            },
            {
                date: '2020-03-15',
                cases: 61
            },
            {
                date: '2020-03-16',
                cases: 72
            },
            {
                date: '2020-03-17',
                cases: 84
            }
        ];
    }
}