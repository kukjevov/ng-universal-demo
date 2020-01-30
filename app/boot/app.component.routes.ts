import {Type} from '@angular/core';
import {ModuleRoutesOptions} from '@anglr/common/router';

import {HomeComponent} from '../pages/home/home.component';
import {AccessDeniedComponent} from "../pages/accessDenied/accessDenied.component";
import {LoginComponent} from "../pages/login/login.component";
import {NotFoundComponent} from "../pages/notFound/notFound.component";
import {dynamicComponentPageRoute} from '../ngDynamic-core';
import {GardenComponent} from '../pages/garden/garden.component';

export const routes: Type<any>[] =
[
    HomeComponent,
    GardenComponent,
    AccessDeniedComponent,
    LoginComponent,
    NotFoundComponent
];

export const routesOptions: ModuleRoutesOptions =
{
    rootModule: true,
    rootModuleConfig:
    {
        enableTracing: false
    },
    staticRoutesBefore:
    [
        dynamicComponentPageRoute,
        {
            path: 'samples',
            loadChildren: () => import('../pages/+samples/samples.module').then(({SamplesModule}) => SamplesModule)
        },
        {
            path: 'perfSample',
            loadChildren: () => import('../pages/+perf/perf.module').then(({PerfModule}) => PerfModule)
        },
        {
            path: 'designer',
            loadChildren: () => import('../ngDynamic-designer/modules/ngDynamicDesigner.module').then(({NgDynamicDesignerModule}) => NgDynamicDesignerModule)
        }
    ]
};