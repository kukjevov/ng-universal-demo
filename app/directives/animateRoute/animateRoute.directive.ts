import {Directive} from '@angular/core';

/**
 * Directive that is used for animating route transitions
 */
@Directive(
{
    selector: '[animateRoute]',
    host:
    {
        'animate.enter': 'page-fade-in',
        'animate.leave': 'page-fade-out',
    },
})
export class AnimateRouteDirective
{
}
