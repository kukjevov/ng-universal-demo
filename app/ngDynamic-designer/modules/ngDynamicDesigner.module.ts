import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CdkTreeModule} from "@angular/cdk/tree";

import {LayoutDesignerComponent, NodeDesignerModeComponent, designerComponentRoutes, designerComponents, PropertiesComponent, ComponentPaletteComponent, ComponentPaletteItemComponent, NodeComponentPaletteComponent, LayoutDesignerTreeComponent, PropertyComponent, CodeEditorComponent, OnlyVisiblePipe, CustomPropertyControlDirective, LeftTopRightBottomNumberComponent, TogglePanelComponent} from "../components";
import {NgDynamicDesignerModuleCore} from "./ngDynamicDesignerCore.module";
import {NgDynamicNodeDesignerModule} from "./ngDynamicNodeDesigner.module";

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
        OnlyVisiblePipe,
        CustomPropertyControlDirective,
        LeftTopRightBottomNumberComponent
    ],
    exports:
    [
        NgDynamicDesignerModuleCore
    ],
    entryComponents:
    [
        LeftTopRightBottomNumberComponent
    ]
})
export class NgDynamicDesignerModule
{
}