import {NgModule, ClassProvider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
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
import {WebpackTranslateLoaderService} from '../services/webpackTranslateLoader';
import {DialogMetadataSelectorComponent} from '../pages/home/dialogMetadataSelector/dialogMetadataSelector.component';
import {VerticalDragNDropSelectionComponent} from '../pages/home/dialogMetadataSelector/components';


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
        DragDropModule,
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
        })
    ],
    providers: providers,
    declarations: [AppComponent, NavigationComponent, DialogMetadataSelectorComponent, VerticalDragNDropSelectionComponent, ...routes],
    exports: [AppComponent]
})
@ModuleRoutes(routes, routesOptions)
export class AppModule
{
}
