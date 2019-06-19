import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {CommonSharedModule} from './commonShared.module';
import {providers} from './app.config';
import {NotificationsPageComponent} from '../pages/notifications/notifications.component';
import {StaticSelectPageComponent} from '../pages/staticSelect/staticSelect.component';
import {SelectPageComponent} from '../pages/select/select.component';

/**
 * Main module shared for both server and browser side
 */
@NgModule(
{
    imports:
    [
        BrowserModule,
        RouterModule.forRoot(
        [
            {
                path: '',
                component: NotificationsPageComponent
            },
            {
                path: 'static',
                component: StaticSelectPageComponent
            },
            {
                path: 'select',
                component: SelectPageComponent
            }
        ]),
        CommonSharedModule
    ],
    providers: providers,
    declarations: [AppComponent, NotificationsPageComponent, StaticSelectPageComponent, SelectPageComponent],
    exports: [AppComponent]
})
export class AppModule
{
}
