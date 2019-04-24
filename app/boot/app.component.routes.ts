import {RouterModule} from '@angular/router';
//@ts-ignore
import {Utils} from '@ng/common';

import {HomeComponent} from '../pages/home/home.component';
import {AccessDeniedComponent} from "../pages/accessDenied/accessDenied.component";
import {LoginComponent} from "../pages/login/login.component";
import {NotFoundComponent} from "../pages/notFound/notFound.component";

var componentRoutes = Utils.routerHelper.extractRoutes([HomeComponent,
                                                        AccessDeniedComponent,
                                                        LoginComponent,
                                                        NotFoundComponent]);

var routes = 
[
    { 
        path: 'samples', 
        loadChildren: '../pages/+samples/samples.module#SamplesModule'
    },
    ...componentRoutes
];

export var appRoutesModule = RouterModule.forRoot(routes, {enableTracing: false});
export var appComponents = [HomeComponent,
                            AccessDeniedComponent,
                            LoginComponent,
                            NotFoundComponent];
