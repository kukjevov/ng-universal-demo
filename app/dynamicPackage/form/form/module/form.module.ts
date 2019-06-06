import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {FormComponent} from "../component";
import {NgDynamicCoreModule} from "../../../../ngDynamic-core";

/**
 * Module for form component
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
        FormComponent
    ],
    entryComponents:
    [
        FormComponent
    ]
})
export class FormModule
{
}