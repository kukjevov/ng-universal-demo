import {NgModule} from '@angular/core';
import {TitledDialogModule} from '@anglr/common/material';

import {DisplayingFeatureModule} from '../../displayingFeature.module';
import {MainMenuComponent} from '../components';
import {UserSettingsSAComponent} from '../../../components';

/**
 * Module for menu components
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        UserSettingsSAComponent,
        TitledDialogModule,
    ],
    declarations:
    [
        MainMenuComponent
    ],
    exports:
    [
        MainMenuComponent
    ]
})
export class MenuModule
{
}