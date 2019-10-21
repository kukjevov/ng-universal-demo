import {NgModule, ClassProvider} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppComponent} from './app.component';
import {CommonSharedModule} from './commonShared.module';
import {providers} from './app.config';
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {HomeComponent} from '../pages/home/home.component';
import {GardenComponent} from '../pages/garden/garden.component';
import {TestWrapper, TestContent} from './test';


/**
 * Main module shared for both server and browser side
 */
@NgModule(
{
    imports:
    [
        BrowserModule.withServerTransition(
        {
            appId: 'APP_TRANSFER_ID'
        }),
        HttpClientModule,
        CommonSharedModule,
        HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true
        }),
        MatDialogModule,
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>
            {
                provide: TranslateLoader, 
                useClass: WebpackTranslateLoaderService
            }
        }),
        RouterModule.forRoot(
        [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'garden',
                component: GardenComponent
            }
        ])
    ],
    providers: providers,
    declarations: [AppComponent, HomeComponent, TestWrapper, TestContent, GardenComponent],
    exports: [AppComponent]
})
export class AppModule
{
}
