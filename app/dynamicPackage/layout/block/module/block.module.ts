import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {BlockComponent} from "../component";
import {NgDynamicCoreModule} from "../../../../ngDynamic-core";

/**
 * Module for block layout component
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgDynamicCoreModule
    ],
    declarations:
    [
        BlockComponent
    ],
    entryComponents:
    [
        BlockComponent
    ]
})
export class BlockModule
{
}