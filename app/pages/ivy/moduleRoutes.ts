import {Type} from '@angular/core';
import {RouterModule, Route} from '@angular/router';
import {Utils} from '@ng/common';


export interface ModuleRoutesOptions
{
  rootModule?: boolean;
  staticRoutesBefore?: Route[];
  staticRoutesAfter?: Route[];
}

export function ModuleRoutes(routedComponents: Type<any>[], options: ModuleRoutesOptions = {rootModule: false, staticRoutesAfter: [], staticRoutesBefore: []})
{
    return function<TFunction extends Function> (target: TFunction): TFunction
    {
      let ngModule: 
      {
        ngInjectorDef:
        {
          imports: any[]
        }
      } = target as any;
      
      if(ngModule.ngInjectorDef && Array.isArray(ngModule.ngInjectorDef.imports))
      {
        let routes = 
        [
          ...options.staticRoutesBefore || [],
          ...Utils.routerHelper.extractRoutes(routedComponents),
          ...options.staticRoutesAfter || []
        ];

        ngModule.ngInjectorDef.imports.push(options.rootModule ? RouterModule.forRoot(routes) : RouterModule.forChild(routes));
      }

      return target;
    };
}