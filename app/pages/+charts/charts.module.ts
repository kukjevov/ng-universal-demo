import {NgModule} from "@angular/core";
import {ModuleRoutes} from "@anglr/common/router";

import {components} from "./charts.routes";
import {BarChartComponent} from './charts/components/barChart/barChart.component';
import {LineChartComponent} from './charts/components/lineChart/lineChart.component';

/**
 * Module for charts pages
 */
@NgModule(
{
    imports:
    [
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