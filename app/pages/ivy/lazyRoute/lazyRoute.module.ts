import {NgModule, ValueProvider} from '@angular/core';

import {components} from './lazyRoute.routes';
import {ModuleRoutes} from '../moduleRoutes';
import {ProvideClass} from '../provider';
import {CommonSharedModule} from '../../../boot/commonShared.module';

@NgModule(
{
  imports:
  [
    CommonSharedModule
  ],
  declarations: 
  [
    ...components
  ],
  providers:
  [
      <ValueProvider>
      {
          provide: ProvideClass,
          useValue:
          {
              value: "my lazy module value"
          }
      }
  ]
})
@ModuleRoutes(components)
export class LazyRouteModule 
{
}

console.log(LazyRouteModule);