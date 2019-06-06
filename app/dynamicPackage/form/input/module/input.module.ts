import {NgModule} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {InputComponent} from "../component";

/**
 * Module for input component
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations:
    [
        InputComponent
    ],
    entryComponents:
    [
        InputComponent
    ]
})
export class InputModule
{
}