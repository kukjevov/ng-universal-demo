import {Route} from '@angular/router';

/**
 * Route for access denied component
 */
export const accessDeniedRoute: Route =
{
    path: 'accessDenied',
    loadComponent: () => import('./accessDenied.component').then(({AccessDeniedComponent}) => AccessDeniedComponent)
};