import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';
import {AttachPluginsSADirective, BasicPagingSAComponent, MatrixGridModule, ShowMetadataSelectorForSADirective, UseTableSADirective} from '@anglr/grid';
import {DialogMetadataSelectorSAComponent} from '@anglr/grid/material';
import {MarkdownModule} from '@anglr/md-help/web';

import {components} from './default.routes';
import {DebuggingFeatureModule, DisplayingFeatureModule, FormsFeatureModule} from '../../modules';

/**
 * Module for Default application pages
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule,
        DebuggingFeatureModule,
        MatrixGridModule,
        MarkdownModule,
        UseTableSADirective,
        AttachPluginsSADirective,
        BasicPagingSAComponent,
        DialogMetadataSelectorSAComponent,
        ShowMetadataSelectorForSADirective,
    ],
    declarations:
    [
        ...components
    ]
})
@ModuleRoutes(components)
export class DefaultModule
{
}