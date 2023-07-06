import {Type} from '@angular/core';
import {ModuleRoutesOptions} from '@anglr/common/router';

import {accessDeniedRoute} from '../pages/accessDenied/accessDenied.route';
import {notFoundRoute} from '../pages/notFound/notFound.route';

export const components: Type<any>[] =
[
];

export const routesOptions: ModuleRoutesOptions =
{
    rootModule: true,
    rootModuleConfig:
    {
        enableTracing: false,
        bindToComponentInputs: true,
        // preloadingStrategy: PreloadAllModules
    },
    staticRoutesBefore:
    [
        {
            path: '',
            loadChildren: () => import('../pages/+default/default.module').then(({DefaultModule}) => DefaultModule)
        }
    ],
    staticRoutesAfter:
    [
        accessDeniedRoute,
        notFoundRoute,
    ]
};