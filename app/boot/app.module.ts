import {NgModule, ClassProvider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ModuleRoutes} from '@anglr/common/router';
import {ConsoleLogModule} from '@anglr/common/structured-log';
import {TitledDialogModule} from '@anglr/common/material';
import {InternalServerErrorModule} from '@anglr/error-handling';
import {DateTimeSelectorModule} from '@anglr/datetime';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppComponent} from './app.component';
import {components, routesOptions} from './app.component.routes';
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {providers} from './app.config';
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {UserSettingsComponent} from '../components';

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
        HotkeyModule,
        ConsoleLogModule.forRoot(),
        TitledDialogModule,
        DateTimeSelectorModule,
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>
            {
                provide: TranslateLoader, 
                useClass: WebpackTranslateLoaderService
            }
        })
    ],
    providers: providers,
    declarations:
    [
        AppComponent,
        UserSettingsComponent,
        ...components
    ],
    exports: [AppComponent]
})
@ModuleRoutes(components, routesOptions)
export class AppModule
{
}
