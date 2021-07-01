import {NgModule} from '@angular/core';
import {TitledDialogModule} from '@anglr/common/material';

import {DisplayingFeatureModule} from '../../displayingFeature.module';
import {UserSettingsModule} from '../../userSettings';
import {MainMenuComponent} from '../components';

/**
 * Module for menu components
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        UserSettingsModule,
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