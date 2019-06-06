import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {SimpleComponent} from "../component";

/**
 * Module for simple component showcase
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
        SimpleComponent
    ],
    entryComponents: 
    [
        SimpleComponent
    ]
})
export class SimpleModule
{
}