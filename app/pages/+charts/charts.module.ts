import {NgModule} from "@angular/core";
import {ModuleRoutes} from "@anglr/common/router";

import {components} from "./charts.routes";
import {BarChartComponent} from './charts/components/barChart/barChart.component';
import {LineChartComponent} from './charts/components/lineChart/lineChart.component';
import {CommonSharedModule} from '../../boot/commonShared.module';

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
        BarChartComponent,
        LineChartComponent
    ]
})
@ModuleRoutes(components)
export class ChartsModule
{
}