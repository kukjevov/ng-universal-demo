import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CdkTreeModule} from "@angular/cdk/tree";

import {LayoutDesignerComponent, NodeDesignerModeComponent, designerComponentRoutes, designerComponents, PropertiesComponent, ComponentPaletteComponent, ComponentPaletteItemComponent, NodeComponentPaletteComponent, LayoutDesignerTreeComponent, PropertyComponent, CodeEditorComponent, OnlyVisiblePipe} from "../components";
import {NgDynamicDesignerModuleCore} from "./ngDynamicDesignerCore.module";
import {NgDynamicNodeDesignerModule} from "./ngDynamicNodeDesigner.module";
import {TogglePanelComponent} from "../components/togglePanel/togglePanel.component";

/**
 * Module for ng dynamic designer 
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        ReactiveFormsModule,
        NgDynamicDesignerModuleCore,
        NgDynamicNodeDesignerModule,
        CdkTreeModule,
        RouterModule.forChild(designerComponentRoutes)
    ],
    declarations: 
    [
        designerComponents,
        LayoutDesignerComponent,
        LayoutDesignerTreeComponent,
        ComponentPaletteComponent,
        ComponentPaletteItemComponent,
        NodeDesignerModeComponent,
        PropertiesComponent,
        PropertyComponent,
        CodeEditorComponent,
        NodeComponentPaletteComponent,
        TogglePanelComponent,
        OnlyVisiblePipe
    ],
    exports:
    [
        NgDynamicDesignerModuleCore
    ]
})
export class NgDynamicDesignerModule
{
}