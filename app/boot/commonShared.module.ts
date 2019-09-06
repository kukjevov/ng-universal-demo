import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BootstrapCoreModule} from '@ng/bootstrap/core';
import {DatetimepickerModule} from '@ng/bootstrap/datetimepicker';
import {TypeaheadModule, TypeaheadTagsModule} from '@ng/bootstrap/typeahead';
import {GridModule} from '@ng/grid';
import {NgSelectModule, NgSelectDynamicModule} from '@ng/select';
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
        NgCommonModule,
        NumeralModule,
        NumberInputModule,
        TranslateModule,
        BootstrapCoreModule,
        DatetimepickerModule,
        TypeaheadModule,
        TypeaheadTagsModule,
        NotificationsModule,
        GridModule,
        AuthorizationModule,
        NgSelectModule,
        NgSelectDynamicModule,
        InternalServerErrorModule
    ]
})
export class CommonSharedModule
{
}