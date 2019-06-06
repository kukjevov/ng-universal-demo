import {NgModule} from '@angular/core';

import {HelloWorld} from './hello-world';
import {ModuleRoutes} from './moduleRoutes';
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