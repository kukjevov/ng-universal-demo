import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgSelectEditModule, NgSelectModule} from '@anglr/select';
import {NumberInputModule, HasErrorModule, FormPipesModule} from '@anglr/common/forms';
import {SimpleDatePickerInputSADirective, SimpleDateTimePickerInputSADirective, SimpleDateTimeInputHandlerSADirective, DateTimeModule, DateTimePickerModule, WithTimeSADirective, WithTodaySADirective, WithNowSADirective, DatePickerInputSADirective, DateTimePickerInputSADirective, DateTimeInputHandlerSADirective} from '@anglr/datetime';

/**
 * Common module for enabling forms features
 */
@NgModule(
{
    imports:
    [
        WithTimeSADirective,
        WithTodaySADirective,
        WithNowSADirective,
        SimpleDatePickerInputSADirective,
        SimpleDateTimePickerInputSADirective,
        SimpleDateTimeInputHandlerSADirective,
        DatePickerInputSADirective,
        DateTimePickerInputSADirective,
        DateTimeInputHandlerSADirective,

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
        WithTimeSADirective,
        WithTodaySADirective,
        WithNowSADirective,
        SimpleDatePickerInputSADirective,
        SimpleDateTimePickerInputSADirective,
        SimpleDateTimeInputHandlerSADirective,
        DatePickerInputSADirective,
        DateTimePickerInputSADirective,
        DateTimeInputHandlerSADirective,
    ]
})
export class FormsFeatureModule
{
}