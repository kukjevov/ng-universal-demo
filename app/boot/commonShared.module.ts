import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ProgressIndicatorModule} from '@ng/common';
import {BootstrapCoreModule} from '@ng/bootstrap/core';
import {DatetimepickerModule} from '@ng/bootstrap/datetimepicker';
import {TypeaheadModule, TypeaheadTagsModule} from '@ng/bootstrap/typeahead';
import {GridModule} from '@ng/grid';
import {VirtualScrollTableContentRendererModule} from '@ng/grid/material';
import {NgSelectModule, NgSelectDynamicModule, NgSelectEditModule} from '@ng/select';
import {CommonModule as NgCommonModule} from '@ng/common';
import {NumeralModule} from '@ng/common/numeral';
import {NumberInputModule} from '@ng/common/forms';
import {NotificationsModule} from '@ng/notifications';
import {InternalServerErrorModule} from '@ng/error-handling';
import {AuthorizationModule} from '@ng/authentication';
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