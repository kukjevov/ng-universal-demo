import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';
import {MatDialogModule} from '@angular/material/dialog';

import {sampleComponents} from './samples.component.routes';
import {CommonSharedModule} from "../../boot/commonShared.module";
import {TypeaheadTagsSourceDirective, TypeaheadSourceDirective} from "../../components/directives/taSources";
import {SampleDialogComponent} from './dialog/sampleDialog.component';

@NgModule(
{
    declarations: [TypeaheadSourceDirective, TypeaheadTagsSourceDirective, SampleDialogComponent, ...sampleComponents],
    imports:
    [
        CommonSharedModule,
        MatDialogModule
    ]
})
@ModuleRoutes(sampleComponents)
export class SamplesModule
{
}
