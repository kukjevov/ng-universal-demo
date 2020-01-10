import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ProgressIndicatorModule} from '@anglr/common';
import {BootstrapCoreModule} from '@anglr/bootstrap/core';
import {DatetimepickerModule} from '@anglr/bootstrap/datetimepicker';
import {TypeaheadModule, TypeaheadTagsModule} from '@anglr/bootstrap/typeahead';
import {GridModule} from '@anglr/grid';
import {VirtualScrollTableContentRendererModule} from '@anglr/grid/material';
import {NgSelectModule, NgSelectDynamicModule, NgSelectEditModule} from '@anglr/select';
import {CommonModule as NgCommonModule} from '@anglr/common';
import {NumeralModule} from '@anglr/common/numeral';
import {NumberInputModule} from '@anglr/common/forms';
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
        ReactiveFormsModule,
        RouterModule,
        ScrollingModule,
        NgCommonModule,
        ProgressIndicatorModule,
        NumeralModule,
        NumberInputModule,
        TranslateModule,
        BootstrapCoreModule,
        DatetimepickerModule,
        TypeaheadModule,
        TypeaheadTagsModule,
        NotificationsModule,
        GridModule,
        VirtualScrollTableContentRendererModule,
        AuthorizationModule,
        NgSelectModule,
        NgSelectDynamicModule,
        NgSelectEditModule,
        InternalServerErrorModule
    ]
})
export class CommonSharedModule
{
}