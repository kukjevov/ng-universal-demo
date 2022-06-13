import {Route} from '@angular/router';

/**
 * Route for not found component
 */
export const notFoundRoute: Route =
{
    path: '**',
    loadComponent: () => import('./notFound.component').then(({NotFoundComponent}) => NotFoundComponent)
};