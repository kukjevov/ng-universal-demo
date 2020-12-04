import {NgModule} from '@angular/core';

import {DisplayingFeatureModule} from '../../displayingFeature.module';
import {MainMenuComponent} from '../components';

/**
 * Module for menu components
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule
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