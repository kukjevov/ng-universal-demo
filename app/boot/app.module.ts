import {NgModule, ClassProvider} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ModuleRoutes} from '@anglr/common/router';
import {ConsoleLogModule} from '@anglr/common/structured-log';
import {ProgressIndicatorModule} from '@anglr/common';
import {InternalServerErrorModule} from '@anglr/error-handling';
import {NotificationsGlobalModule} from '@anglr/notifications';
import {TranslateModule, TranslateLoader, MissingTranslationHandler} from '@ngx-translate/core';
import {HotkeyModule} from 'angular2-hotkeys';

import {AppComponent} from './app.component';
import {components, routesOptions} from './app.component.routes';
import {globalProviders} from './app.config';
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {MenuModule} from '../modules';
import {config} from '../config';
import {ReportMissingTranslationService} from '../services/missingTranslation';

/**
 * Main module shared for both server and browser side
 */
@NgModule(
{
    imports:
    [
        HttpClientModule,
        InternalServerErrorModule,
        ProgressIndicatorModule,
        NotificationsGlobalModule,
        RouterModule,
        HotkeyModule,
        MenuModule,
        ConsoleLogModule,
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>
            {
                provide: TranslateLoader, 
                useClass: WebpackTranslateLoaderService
            },
            ...config.configuration.debugTranslations ? 
                {
                    missingTranslationHandler:
                    {
                        provide: MissingTranslationHandler,
                        useClass: ReportMissingTranslationService
                    }
                } : 
                {
                },
            useDefaultLang: !config.configuration.debugTranslations
        })
    ],
    providers: globalProviders,
    declarations:
    [
        AppComponent,
        ...components
    ],
    exports: [AppComponent]
})
@ModuleRoutes(components, routesOptions)
export class AppModule
{
}
