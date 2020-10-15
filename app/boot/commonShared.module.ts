import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {ProgressIndicatorModule, DebugDataModule} from '@anglr/common';
import {DatetimepickerModule} from '@anglr/bootstrap/datetimepicker';
import {TypeaheadModule, TypeaheadTagsModule} from '@anglr/bootstrap/typeahead';
import {GridModule} from '@anglr/grid';
import {NgSelectModule} from '@anglr/select';
import {CommonModule as NgCommonModule} from '@anglr/common';
import {NumeralModule} from '@anglr/common/numeral';
import {NumberInputModule} from '@anglr/common/forms';
import {TooltipModule} from '@anglr/common/positions';
import {NotificationsModule} from '@anglr/notifications';
import {InternalServerErrorModule} from '@anglr/error-handling';
import {AuthorizationModule} from '@anglr/authentication';
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
        RouterModule,
        MatSlideToggleModule,
        ClipboardModule,
        NgCommonModule,
        ProgressIndicatorModule,
        DebugDataModule,
        NumeralModule,
        NumberInputModule,
        TranslateModule,
        DatetimepickerModule,
        TypeaheadModule,
        TypeaheadTagsModule,
        NotificationsModule,
        GridModule,
        AuthorizationModule,
        NgSelectModule,
        InternalServerErrorModule,
        TooltipModule
    ]
})
export class CommonSharedModule
{
}