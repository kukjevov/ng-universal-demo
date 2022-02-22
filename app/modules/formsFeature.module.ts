import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgSelectModule} from '@anglr/select';
import {NumberInputModule, HasErrorModule} from '@anglr/common/forms';
import {DateTimeSelectorModule} from '@anglr/datetime';

/**
 * Common module for enabling forms features
 */
@NgModule(
{
    exports:
    [
        ReactiveFormsModule,
        MatSlideToggleModule,
        NumberInputModule,
        NgSelectModule,
        DateTimeSelectorModule,
        HasErrorModule,
    ]
})
export class FormsFeatureModule
{
}