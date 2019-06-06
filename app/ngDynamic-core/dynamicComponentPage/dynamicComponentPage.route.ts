import {Route} from "@angular/router";

import {DynamicComponentPageComponent} from "./dynamicComponentPage.component";

/**
 * Definition of route for dynamic component page
 */
export const dynamicComponentPageRoute: Route = 
{
    path: 'dynamic',
    children:
    [
        {
            path: '**',
            component: DynamicComponentPageComponent
        }
    ]
};