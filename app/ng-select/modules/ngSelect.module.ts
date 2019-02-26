import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {OptGroupComponent, OptionComponent, NgSelectComponent} from '../components';
import {NgSelectControlValueAccessor} from '../misc/ngSelectControlValueAccessor.directive';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        CommonModule
    ],
    declarations:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor
    ]
})
export class NgSelectModule
{
}