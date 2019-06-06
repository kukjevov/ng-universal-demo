import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {StackDesignerComponent} from "../component";
import {NgDynamicDesignerModule} from "../../../../../../ngDynamic-designer";

/**
 * Module for stack designer layout component
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
        StackDesignerComponent
    ],
    entryComponents: 
    [
        StackDesignerComponent
    ]
})
export class StackDesignerModule
{
}