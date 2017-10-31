import {NgModule, ClassProvider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ExternalTranslationLoader, ExternalTranslationLoaderOptions, ExternalTranslationLoaderModule} from '@ng/external-translation-loader';
import {NotificationsModule} from '@ng/notifications';
import {CommonModule as NgCommonModule, ProgressIndicatorModule} from '@ng/common';
import {AuthorizationModule} from '@ng/authentication';
import {ServerValidationsModule, HttpErrorInterceptorModule, HttpErrorInterceptorOptions, InternalServerErrorModule} from '@ng/error-handling';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {NavigationComponent} from '../components/navigation/navigation.component';
import {AccountService} from "../services/api/account/account.service";
import {appComponents, appRoutesModule} from './app.component.routes';
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {GlobalizationService as GlobalizationServiceImpl} from '../services/globalization/globalization.service';
import {providers} from './app.config';
import * as config from 'config/global';

/**
 * Factory for HttpErrorInterceptorOptions
 */
export function httpErrorInterceptorModuleFactory()
{
    return new HttpErrorInterceptorOptions(config.debug);
}

/**
 * Factory method that is used for creating InterceptableHttp
 */
export function externalTranslationLoaderOptionsFactory()
{
    return new ExternalTranslationLoaderOptions("config/i18n",
                                                ["global", 
                                                 "navigation", 
                                                 "pages/home",
                                                 "pages/samplePages"],
                                                ".json")
}

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
        TranslateModule.forRoot(
        {
            loader: <ClassProvider>{provide: TranslateLoader, useClass: ExternalTranslationLoader}
        }),
        NotificationsModule.forRoot(),
        NgCommonModule.forRootWithGlobalization(GlobalizationServiceImpl),
        ExternalTranslationLoaderModule.forRootWithOptions(externalTranslationLoaderOptionsFactory),
        AuthorizationModule.forRoot(AccountService),
        ServerValidationsModule.forRoot(),
        InternalServerErrorModule.forRoot(),
        ProgressIndicatorModule.forRoot(),
        HttpErrorInterceptorModule.forRootWithOptions(httpErrorInterceptorModuleFactory),
        CommonSharedModule,
        appRoutesModule
    ],
    providers: providers,
    declarations: [AppComponent, NavigationComponent, ...appComponents],
    exports: [AppComponent]
})
export class AppModule
{
}
