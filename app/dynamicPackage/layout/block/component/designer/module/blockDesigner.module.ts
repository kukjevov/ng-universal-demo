import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {BlockDesignerComponent} from "../component";
import {NgDynamicDesignerModule} from "../../../../../../ngDynamic-designer";

/**
 * Module for block designer layout component
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
        BlockDesignerComponent
    ],
    entryComponents: 
    [
        BlockDesignerComponent
    ]
})
export class BlockDesignerModule
{
}