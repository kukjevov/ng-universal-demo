import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BootstrapModule} from '@ng/bootstrap';
import {GridModule} from '@ng/grid';
import {CommonModule as NgCommonModule} from '@ng/common';
import {NotificationsModule} from '@ng/notifications';
import {InternalServerErrorModule, ServerValidationsModule} from '@ng/error-handling';
import {AuthorizationModule} from '@ng/authentication';
import {FancyTreeModule} from '@ng/treeview';
import {NgSelectModule, NgSelectDynamicModule} from '../ng-select';
import {TranslateModule} from '@ngx-translate/core';

/**
 * Common module for all other modules
 */
@NgModule(
{
    // declarations: [NavigationComponent],
    exports:
    [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgCommonModule,
        TranslateModule,
        NotificationsModule,
        GridModule,
        AuthorizationModule,
        FancyTreeModule,
        NgSelectModule,
        NgSelectDynamicModule,
        InternalServerErrorModule,
        ServerValidationsModule,
        BootstrapModule
    ]
})
export class CommonSharedModule
{
}