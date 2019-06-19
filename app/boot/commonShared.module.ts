import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NotificationsModule} from '@ng/notifications';
import {NgSelectModule} from '@ng/select';

/**
 * Common module for all other modules
 */
@NgModule(
{
    exports:
    [
        CommonModule,
        RouterModule,
        NotificationsModule,
        NgSelectModule
    ]
})
export class CommonSharedModule
{
}