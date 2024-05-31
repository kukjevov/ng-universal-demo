import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CommonUtilsModule, CommonLocalizeModule, TooltipModule, NumeralPipe} from '@anglr/common';
import {AuthorizeDirective} from '@anglr/authentication';
import {DatePipesModule} from '@anglr/datetime';
import {TranslateModule} from '@ngx-translate/core';

/**
 * Common module for displaying readonly data helpers
 */
@NgModule(
{
    imports:
    [
        NumeralPipe,
        AuthorizeDirective,
    ],
    exports:
    [
        CommonModule,
        RouterModule,
        CommonUtilsModule,
        CommonLocalizeModule,
        NumeralPipe,
        TooltipModule,
        TranslateModule,
        DatePipesModule,
        AuthorizeDirective,
    ]
})
export class DisplayingFeatureModule
{
}