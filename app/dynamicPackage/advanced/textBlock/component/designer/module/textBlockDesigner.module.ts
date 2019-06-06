import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {NgDynamicDesignerModule} from "../../../../../../ngDynamic-designer";
import {TextBlockDesignerComponent} from "../component";

/**
 * Module for text block designer layout component
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
        TextBlockDesignerComponent
    ],
    entryComponents: 
    [
        TextBlockDesignerComponent
    ]
})
export class TextBlockDesignerModule
{
}