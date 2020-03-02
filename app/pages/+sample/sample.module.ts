import {NgModule} from "@angular/core";
import {ModuleRoutes} from "@anglr/common/router";

import {CommonSharedModule} from "../../boot/commonShared.module";
import {components} from "./sample.routes";
import {ExampleModule} from "../../modules";

/**
 * Module for sample pages
 */
@NgModule(
{
    declarations:
    [
        ...components
    ],
    imports:
    [
        CommonSharedModule,
        ExampleModule
    ]
})
@ModuleRoutes(components)
export class SampleModule
{
}