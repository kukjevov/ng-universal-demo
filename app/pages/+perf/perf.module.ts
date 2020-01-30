import {NgModule} from "@angular/core";
import {CommonSharedModule} from "../../boot/commonShared.module";
import {ModuleRoutes} from "@anglr/common/router";

import {components} from "./perf.routes";
import {OknoComponent} from "./hodnotenie/okno/okno.component";
import {TabulkaComponent} from "./hodnotenie/tabulka/tabulka.component";
import {TabulkaRiadokComponent} from "./hodnotenie/tabulkaRiadok/tabulkaRiadok.component";
import {ChartComponent} from "./hodnotenie/charts/chart.component";
import {OverviewLineComponent} from "./hodnotenie/overviewLine/overviewLine.component";
import {HodnotenieStateChanging, HodnotenieDataResolver} from "./hodnotenie/hodnotenieData.resolver";
import {HodnotenieService} from "../../services/api/hodnotenie";

@NgModule(
{
    imports:
    [
        CommonSharedModule
    ],
    declarations:
    [
        OknoComponent,
        TabulkaComponent,
        TabulkaRiadokComponent,
        ChartComponent,
        OverviewLineComponent,
        ...components
    ],
    providers:
    [
        HodnotenieStateChanging,
        HodnotenieService,
        HodnotenieDataResolver
    ]
})
@ModuleRoutes(components)
export class PerfModule
{
}