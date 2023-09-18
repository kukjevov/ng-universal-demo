import {ClassProvider, EnvironmentProviders, Provider, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideClientHydration} from '@angular/platform-browser';
import {MatDialogModule} from '@angular/material/dialog';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {TitledDialogService} from '@anglr/common/material';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {ReportMissingTranslationService} from '../services/missingTranslation';
import {config} from '../config';
import {routes} from './app.component.routes';

/**
 * Root app providers 
 */
export const appProviders: (Provider|EnvironmentProviders)[] =
[
    provideClientHydration(),
    provideZoneChangeDetection({eventCoalescing: true, runCoalescing: true}),
    provideHttpClient(withInterceptorsFromDi(),),
    importProvidersFrom(MatDialogModule),
    TitledDialogService,
    importProvidersFrom(TranslateModule.forRoot(
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
    })),
    provideRouter(routes,
                  withComponentInputBinding()),
];