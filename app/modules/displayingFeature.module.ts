import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CommonModule as NgCommonModule} from '@anglr/common';
import {NumeralModule} from '@anglr/common/numeral';
import {TooltipModule} from '@anglr/common/positions';
import {AuthorizationModule} from '@anglr/authentication';
import {TranslateModule} from '@ngx-translate/core';

/**
 * Common module for displaying readonly data helpers
 */
@NgModule(
{
    exports:
    [
        CommonModule,
        RouterModule,
        NgCommonModule,
        NumeralModule,
        TooltipModule,
        TranslateModule,
        AuthorizationModule
    ]
})
export class DisplayingFeatureModule
{
}