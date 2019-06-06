import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ConditionalDesignerComponent} from "../component";
import {NgDynamicDesignerModule} from "../../../../../../ngDynamic-designer";

/**
 * Module for conditional designer layout component
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgDynamicDesignerModule
    ],
    declarations: 
    [
        ConditionalDesignerComponent
    ],
    entryComponents: 
    [
        ConditionalDesignerComponent
    ]
})
export class ConditionalDesignerModule
{
}