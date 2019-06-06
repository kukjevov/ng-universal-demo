import {NgModule, ValueProvider} from '@angular/core';
import {NgSelectModule} from '@ng/select';

import {SelectComponent} from './select.component';
import {ProvideClass} from '../provider';



@NgModule(
{
  imports:
  [
      NgSelectModule
  ],
  declarations: 
  [
    SelectComponent
  ],
  providers:
  [
    <ValueProvider>
    {
      provide: ProvideClass,
      useValue:
      {
        value: "my select module value"
      }
    }
  ]
})
export class SelectModule 
{
}