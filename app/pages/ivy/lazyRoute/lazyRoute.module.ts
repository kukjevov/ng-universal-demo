import {NgModule, ValueProvider} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonModule as NgCommonModule} from '@ng/common';

import {components} from './lazyRoute.routes';
import {ModuleRoutes} from '../moduleRoutes';
import {ProvideClass} from '../provider';

@NgModule(
{
  imports:
  [
    CommonModule,
    NgCommonModule
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