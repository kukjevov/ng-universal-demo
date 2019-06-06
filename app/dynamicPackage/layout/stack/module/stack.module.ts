import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {StackComponent} from "../component";
import {NgDynamicCoreModule} from "../../../../ngDynamic-core";

/**
 * Module for stack layout component
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
        StackComponent
    ],
    entryComponents: 
    [
        StackComponent
    ]
})
export class StackModule
{
}