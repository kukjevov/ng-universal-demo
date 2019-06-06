import {NgModule, FactoryProvider, Injector} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {ExternalTranslationLoader, ExternalTranslationLoaderOptions} from '@ng/translate-extensions';
import {ProgressIndicatorModule, SERVER_BASE_URL} from '@ng/common';
import {InternalServerErrorModule} from '@ng/error-handling';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {PrebootModule} from 'preboot';

import {AppComponent} from './app.component';
import {NavigationComponent} from '../components/navigation/navigation.component';
import {appComponents, appRoutesModule} from './app.component.routes';
import {CommonSharedModule} from './commonShared.module';
import {APP_TRANSFER_ID} from '../misc/constants';
import {providers} from './app.config';

/**
 * Factory method that is used for creating external translation loader
 */
export function externalTranslationLoaderFactory(http: HttpClient, injector: Injector)
{
    return new ExternalTranslationLoader(new ExternalTranslationLoaderOptions("config/i18n",
                                                                              ["global", 
                                                                               "navigation", 
                                                                               "pages/home",
                                                                               "pages/samplePages"],
                                                                              ".json"),
                                         http,
                                         injector.get(SERVER_BASE_URL, null));
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
            loader: <FactoryProvider>
            {
                provide: TranslateLoader, 
                useFactory: externalTranslationLoaderFactory,
                deps: [HttpClient, Injector]
            }
        }),
        InternalServerErrorModule,
        ProgressIndicatorModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: false}),
        PrebootModule.withConfig({ appRoot: 'app' }),
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
