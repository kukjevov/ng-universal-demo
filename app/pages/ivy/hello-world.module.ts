import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {HelloWorld} from './hello-world';
import {ModuleRoutes} from './moduleRoutes';
import {routes, routesOptions} from './hello-world.routes';

@NgModule(
{
  imports:
  [
    CommonModule,
    BrowserModule,
    RouterModule
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