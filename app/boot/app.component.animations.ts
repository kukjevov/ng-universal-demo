import {trigger, transition, style, group, animate, query, animateChild} from "@angular/animations";

/**
 * Animations run when changing route
 */
export const routeAnimationTrigger = trigger('routeAnimations',
[
    transition('none => *, void => *',
    [
    ]),
    transition('* => *',
    [
        query('.main-content',
        [
            query(':leave, :enter', 
            [
                style(
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 'calc(100% - 14px)',
                    paddingLeft: '80px'
                })
            ]),
            query(':enter', 
            [
                style(
                {
                    opacity: 0.3,
                    top: '100%'
                })
            ]),
            query(':leave', animateChild()),
            group(
            [
                query(':leave', 
                [
                    animate('800ms ease-in-out', style(
                    {
                        opacity: 0.3,
                        top: '-100%'
                    }))
                ]),
                query(':enter', 
                [
                    animate('800ms ease-in-out', style(
                    {
                        opacity: 1,
                        top: 0
                    }))
                ])
            ]),
            query(':enter', animateChild())
        ])
    ])
]);