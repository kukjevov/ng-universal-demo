import {NgModule} from '@angular/core';
import {GridModule} from '@ng/grid';
import {NgSelectModule} from '@ng/select';

import {sampleComponents} from './samples.component.routes';
import {CommonSharedModule} from "../../boot/commonShared.module";
import {TypeaheadTagsSourceDirective, TypeaheadSourceDirective} from "../../components/directives/taSources";
import {ModuleRoutes} from '../ivy/moduleRoutes';

@NgModule(
{
    declarations: [TypeaheadSourceDirective, TypeaheadTagsSourceDirective],
    imports:
    [
        CommonSharedModule,
        GridModule,
        NgSelectModule
    ]
})
@ModuleRoutes(sampleComponents)
export class SamplesModule
{
}
