import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@ng/common/router';

import {sampleComponents} from './samples.component.routes';
import {CommonSharedModule} from "../../boot/commonShared.module";
import {TypeaheadTagsSourceDirective, TypeaheadSourceDirective} from "../../components/directives/taSources";

@NgModule(
{
    declarations: [TypeaheadSourceDirective, TypeaheadTagsSourceDirective, ...sampleComponents],
    imports:
    [
        CommonSharedModule,
    ]
})
@ModuleRoutes(sampleComponents)
export class SamplesModule
{
}
