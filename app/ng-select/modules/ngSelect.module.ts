import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgSelectComponent} from '../components/ngSelect.component';
import {OptionComponent} from '../components/option/option.component';
import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {NgSelectControlValueAccessor} from '../misc';

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
        NgSelectComponent,
        OptionComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor
    ],
    exports:
    [
        NgSelectComponent,
        OptionComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor
    ]
})
export class NgSelectModule
{
}