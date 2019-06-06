import {NgModule} from "@angular/core";
// import {CommonModule} from "@angular/common";

import {NodeDesignerComponent} from "../components";

/**
 * Module for ng dynamic node designer 
 */
@NgModule(
{
    imports:
    [
    ],
    declarations: 
    [
        NodeDesignerComponent,
    ],
    exports:
    [
        NodeDesignerComponent
    ]
})
export class NgDynamicNodeDesignerModule
{
}