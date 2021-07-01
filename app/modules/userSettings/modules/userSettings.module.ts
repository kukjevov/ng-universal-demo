import {NgModule} from '@angular/core';

import {DisplayingFeatureModule} from '../../displayingFeature.module';
import {FormsFeatureModule} from '../../formsFeature.module';
import {UserSettingsComponent} from '../components';

/**
 * Module used for definition of user settings component
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule
    ],
    declarations:
    [
        UserSettingsComponent
    ],
    exports:
    [
        UserSettingsComponent
    ]
})
export class UserSettingsModule
{
}