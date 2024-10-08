import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgSelectEditModule, NgSelectModule} from '@anglr/select';
import {NumberInputModule, HasErrorModule, FormPipesModule} from '@anglr/common/forms';
import {SimpleDatePickerInputDirective, SimpleDateTimePickerInputDirective, SimpleDateTimeInputHandlerDirective, DateTimeModule, DateTimePickerModule, WithTimeDirective, WithTodayDirective, WithNowDirective, DatePickerInputDirective, DateTimePickerInputDirective, DateTimeInputHandlerDirective} from '@anglr/datetime';

/**
 * Common module for enabling forms features
 */
@NgModule(
{
    imports:
    [
        WithTimeDirective,
        WithTodayDirective,
        WithNowDirective,
        SimpleDatePickerInputDirective,
        SimpleDateTimePickerInputDirective,
        SimpleDateTimeInputHandlerDirective,
        DatePickerInputDirective,
        DateTimePickerInputDirective,
        DateTimeInputHandlerDirective,
    ],
    exports:
    [
        ReactiveFormsModule,
        MatSlideToggleModule,
        NumberInputModule,
        NgSelectModule,
        NgSelectEditModule,
        HasErrorModule,
        FormPipesModule,
        DateTimeModule,
        DateTimePickerModule,
        WithTimeDirective,
        WithTodayDirective,
        WithNowDirective,
        SimpleDatePickerInputDirective,
        SimpleDateTimePickerInputDirective,
        SimpleDateTimeInputHandlerDirective,
        DatePickerInputDirective,
        DateTimePickerInputDirective,
        DateTimeInputHandlerDirective,
    ]
})
export class FormsFeatureModule
{
}