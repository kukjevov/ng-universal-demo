import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@ng/common/router';

import {HelloWorld} from './hello-world';
import {routes, routesOptions} from './hello-world.routes';
import {CommonSharedModule} from '../../boot/commonShared.module';

@NgModule(
{
  imports:
  [
    CommonSharedModule
  ],
  declarations: 
  [
    HelloWorld
  ],
  exports:
  [
    HelloWorld
  ]
})
@ModuleRoutes(routes, routesOptions)
export class HelloWorldModule 
{
}

console.log(HelloWorldModule);