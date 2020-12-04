import {Type} from '@angular/core';
import {PreloadAllModules} from '@angular/router';
import {ModuleRoutesOptions} from '@anglr/common/router';

import {AccessDeniedComponent} from "../pages/accessDenied/accessDenied.component";
import {NotFoundComponent} from "../pages/notFound/notFound.component";

export const components: Type<any>[] =
[
    AccessDeniedComponent,
    NotFoundComponent
];

export const routesOptions: ModuleRoutesOptions =
{
    rootModule: true,
    rootModuleConfig:
    {
        enableTracing: false,
        preloadingStrategy: PreloadAllModules
    },
    staticRoutesBefore:
    [
        {
            path: '',
            loadChildren: () => import('../pages/+default/default.module').then(({DefaultModule}) => DefaultModule)
        }
    ]
};