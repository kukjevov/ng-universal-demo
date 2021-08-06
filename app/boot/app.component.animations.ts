import {trigger, transition, query, animate, style, animateChild, group} from '@angular/animations';

/**
 * Animations run when changing route
 */
export const routeAnimationTrigger = trigger('routeAnimations',
[
    transition('void <=> *, none <=> *',
    [
        query(':enter', animateChild(), {optional: true})
    ]),
    transition('* => login',
    [
        query('.main-content',
        [
            style(
            {
                position: 'relative',
                perspective: '10000px'
            }),
            query(':enter, :leave',
            [
                style(
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                })
            ]),
            query(':enter',
            [
                style(
                {
                    transform: 'rotateY(-90deg)',
                    opacity: 0
                })
            ]),
            query(':leave', animateChild()),
            group(
            [
                query(':leave',
                [
                    animate('350ms ease-out', style(
                    {
                        transform: 'rotateY(90deg)',
                        opacity: 0
                    }))
                ]),
                query(':enter',
                [
                    animate('350ms 350ms ease-out', style(
                    {
                        transform: 'rotateY(0)',
                        opacity: 1
                    }))
                ])
            ]),
            query(':enter', animateChild())
        ])
    ]),
    transition('login => *',
    [
        query('.main-content',
        [
            style(
            {
                position: 'relative',
                perspective: '10000px'
            }),
            query(':enter, :leave',
            [
                style(
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                })
            ]),
            query(':enter',
            [
                style(
                {
                    transform: 'rotateY(-90deg)',
                    opacity: 0
                })
            ]),
            query(':leave', animateChild()),
            group(
            [
                query(':leave',
                [
                    animate('350ms ease-out', style(
                    {
                        transform: 'rotateY(90deg)',
                        opacity: 0
                    }))
                ]),
                query(':enter',
                [
                    animate('350ms 350ms ease-out', style(
                    {
                        transform: 'rotateY(0)',
                        opacity: 1
                    }))
                ])
            ]),
            query(':enter', animateChild())
        ])
    ]),
    transition('* => *',
    [
        query('.main-content',
        [
            style({ position: 'relative' }),
            query(':enter, :leave',
            [
                style(
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                })
            ]),
            query(':enter',
            [
                style({ opacity: 0})
            ]),
            query(':leave', animateChild()),
            group(
            [
                query(':leave',
                [
                    animate('350ms ease-out', style({ opacity: 0}))
                ]),
                query(':enter',
                [
                    animate('350ms ease-out', style({ opacity: 1}))
                ])
            ]),
            query(':enter', animateChild())
        ])
    ])
]);

export const loaderTrigger = trigger('loaderAnimation',
[
    transition(':leave',
    [
        group(
        [
            query('.loading-card', 
            [
                animate('300ms', style(
                {
                    transform: 'scale(4)'
                }))
            ]),
            animate('200ms 100ms', style(
            {
                opacity: 0
            }))
            
        ])
    ])
]);