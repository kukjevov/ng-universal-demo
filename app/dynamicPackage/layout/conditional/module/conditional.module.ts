import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ConditionalComponent} from "../component";
import {NgDynamicCoreModule} from "../../../../ngDynamic-core";

/**
 * Module for conditional layout component
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
        ConditionalComponent
    ],
    entryComponents: 
    [
        ConditionalComponent
    ]
})
export class ConditionalModule
{
}