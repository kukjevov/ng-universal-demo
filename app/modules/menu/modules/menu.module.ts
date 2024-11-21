import {NgModule} from '@angular/core';

import {MainMenuComponent} from '../components';

/**
 * Module for menu components
 */
@NgModule(
{
    imports:
    [
        MainMenuComponent,
    ],
    exports:
    [
        MainMenuComponent,
    ]
})
export class MenuModule
{
}