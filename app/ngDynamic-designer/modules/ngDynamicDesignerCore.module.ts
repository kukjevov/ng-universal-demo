import {NgModule} from "@angular/core";

import {DesignerComponentRendererDirective, DroppableDirective} from "../directives";
import {DesignerComponentHeaderComponent, DropAreaComponent} from "../components";

/**
 * Core module for ng dynamic designer 
 */
@NgModule(
{
    imports:
    [
    ],
    declarations: 
    [
        DesignerComponentRendererDirective,
        DroppableDirective,
        DesignerComponentHeaderComponent,
        DropAreaComponent
    ],
    exports:
    [
        DesignerComponentRendererDirective,
        DroppableDirective,
        DesignerComponentHeaderComponent,
        DropAreaComponent
    ]
})
export class NgDynamicDesignerModuleCore
{
}