import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgSelectEditModule, NgSelectModule} from '@anglr/select';
import {NumberInputModule, HasErrorModule, FormPipesModule} from '@anglr/common/forms';
import {SimpleDatePickerInputSADirective, SimpleDateTimePickerInputSADirective, SimpleDateTimeInputHandlerSADirective, DateTimeModule, DateTimePickerModule, WithTimeSADirective, WithTodaySADirective} from '@anglr/datetime';

/**
 * Common module for enabling forms features
 */
@NgModule(
{
    imports:
    [
        WithTimeSADirective,
        WithTodaySADirective,
        SimpleDatePickerInputSADirective,
        SimpleDateTimePickerInputSADirective,
        SimpleDateTimeInputHandlerSADirective,
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
        SimpleDatePickerInputSADirective,
        SimpleDateTimePickerInputSADirective,
        SimpleDateTimeInputHandlerSADirective,
    ]
})
export class FormsFeatureModule
{
}