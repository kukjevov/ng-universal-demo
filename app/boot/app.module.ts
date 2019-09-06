import {NgModule, ClassProvider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ProgressIndicatorModule} from '@ng/common';
import {ModuleRoutes} from '@ng/common/router';
import {InternalServerErrorModule} from '@ng/error-handling';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppComponent} from './app.component';
import {NavigationComponent} from '../components/navigation/navigation.component';
import {routes, routesOptions} from './app.component.routes';
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {providers} from './app.config';
import {HelloWorldModule} from '../pages/ivy/hello-world.module';
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';


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
        ProgressIndicatorModule,
        CommonSharedModule,
        HotkeyModule.forRoot(
        {
            cheatSheetCloseEsc: true
        }),
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>
            {
                provide: TranslateLoader, 
                useClass: WebpackTranslateLoaderService
            }
        }),
        HelloWorldModule
    ],
    providers: providers,
    declarations: [AppComponent, NavigationComponent, ...routes],
    exports: [AppComponent]
})
@ModuleRoutes(routes, routesOptions)
export class AppModule
{
}
