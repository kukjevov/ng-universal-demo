import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ButtonComponent} from "../component";

/**
 * Module for button component
 */
@NgModule(
{
    imports:
    [
        CommonModule
    ],
    declarations: 
    [
        ButtonComponent
    ],
    entryComponents: 
    [
        ButtonComponent
    ]
})
export class ButtonModule
{
}