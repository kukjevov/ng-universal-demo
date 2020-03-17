import {NgModule} from "@angular/core";
import {ModuleRoutes} from "@anglr/common/router";

import {components} from "./charts.routes";
import {BarChartComponent} from './charts/components/barChart/barChart.component';
import {LineChartComponent} from './charts/components/lineChart/lineChart.component';
import {CommonSharedModule} from '../../boot/commonShared.module';
import {ChartComponent} from './charts/components/chart/chart.component';
import {SubtractPipe} from './charts/pipes/subtract.pipe';

/**
 * Module for charts pages
 */
@NgModule(
{
    imports:
    [
        CommonSharedModule
    ],
    declarations:
    [
        ...components,
        ChartComponent,
        BarChartComponent,
        LineChartComponent,
        SubtractPipe
    ]
})
@ModuleRoutes(components)
export class ChartsModule
{
}