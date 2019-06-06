import {Type} from "@angular/core";

import {ModuleRoutesOptions} from "./moduleRoutes";
import {RoutedComponent} from "./routed/routed.component";
import {StaticRoutedComponent} from "./routed/staticRouted.component";

export const routes: Type<any>[] =
[
    RoutedComponent
];

export const routesOptions: ModuleRoutesOptions =
{
    rootModule: true,
    staticRoutesBefore:
    [
        {
            path: 'lazy',
            loadChildren: () => import('./lazyRoute/lazyRoute.module').then(({LazyRouteModule}) => LazyRouteModule)
        },
        {
            path: 'static',
            component: StaticRoutedComponent
        }
    ]
};