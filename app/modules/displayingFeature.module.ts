import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CommonUtilsModule, CommonLocalizeModule, TooltipModule} from '@anglr/common';
import {NumeralSAPipe} from '@anglr/common/numeral';
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
        NumeralSAPipe,
        AuthorizeDirective,
    ],
    exports:
    [
        CommonModule,
        RouterModule,
        CommonUtilsModule,
        CommonLocalizeModule,
        NumeralSAPipe,
        TooltipModule,
        TranslateModule,
        DatePipesModule,
        AuthorizeDirective,
    ]
})
export class DisplayingFeatureModule
{
}