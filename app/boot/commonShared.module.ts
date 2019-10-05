import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

/**
 * Common module for all other modules
 */
@NgModule(
{
    exports:
    [
        CommonModule,
        ReactiveFormsModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule
    ]
})
export class CommonSharedModule
{
}