import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';
import {NotificationsLocalModule} from '@anglr/notifications';

import {components} from './default.routes';
import {DebuggingFeatureModule, DisplayingFeatureModule, FormsFeatureModule} from '../../modules';

/**
 * Module for Default application pages
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule,
        DebuggingFeatureModule,
        NotificationsLocalModule,
    ],
    declarations:
    [
        ...components
    ]
})
@ModuleRoutes(components)
export class DefaultModule
{
}