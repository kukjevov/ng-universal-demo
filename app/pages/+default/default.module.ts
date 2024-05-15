import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';

import {components} from './default.routes';

/**
 * Module for Default application pages
 */
@NgModule()
@ModuleRoutes(components)
export default class DefaultModule
{
}