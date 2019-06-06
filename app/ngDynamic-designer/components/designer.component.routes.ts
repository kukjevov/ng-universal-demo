import {Route} from "@angular/router";

import {DesignerPageComponent} from "./designer.component";

/**
 * Definition of route for designer components
 */
export const designerComponentRoutes: Route[] = 
[
    {
        path: ':id',
        component: DesignerPageComponent
    }
];

/**
 * Definition of route components for designer
 */
export var designerComponents = [DesignerPageComponent];