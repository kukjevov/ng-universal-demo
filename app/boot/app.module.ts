import {NgModule, ClassProvider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {ModuleRoutes} from '@anglr/common/router';
import {InternalServerErrorModule} from '@anglr/error-handling';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppComponent} from './app.component';
import {NavigationComponent} from '../components/navigation/navigation.component';
import {routes, routesOptions} from './app.component.routes';
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {providers} from './app.config';
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {TestContent, TestWrapper} from '../components/test';
import {NgDynamicCoreModule} from '../ngDynamic-core';


/**
 * Main module shared for both server and browser side
 */
@NgModule(
{
    imports:
    [
        BrowserModule.withServerTransition(
        {
            appId: APP_TRANSFER_ID
        }),
        HttpClientModule,
        InternalServerErrorModule,
        CommonSharedModule,
        MatDialogModule,
        HotkeyModule,
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>
            {
                provide: TranslateLoader, 
                useClass: WebpackTranslateLoaderService
            }
        }),
        NgDynamicCoreModule.forRoot()
    ],
    providers: providers,
    declarations: [AppComponent, NavigationComponent, TestWrapper, TestContent, ...routes],
    exports: [AppComponent]
})
@ModuleRoutes(routes, routesOptions)
export class AppModule
{
}
