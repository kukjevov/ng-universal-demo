import {Type} from '@angular/core';
import {ModuleRoutesOptions} from '@anglr/common/router';

import {HomeComponent} from '../pages/home/home.component';
import {AccessDeniedComponent} from "../pages/accessDenied/accessDenied.component";
import {LoginComponent} from "../pages/login/login.component";
import {NotFoundComponent} from "../pages/notFound/notFound.component";

export const components: Type<any>[] =
[
    HomeComponent,
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
    ]
};