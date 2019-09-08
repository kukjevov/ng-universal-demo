import {trigger, transition, query, animate, style} from "@angular/animations";

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
            query(":enter",
            [
                animate('7500ms ease-in-out', style(
                {
                    opacity: 0.1
                }))
            ])
            // query(':leave, :enter', 
            // [
            //     // style(
            //     // {
            //     //     position: 'absolute',
            //     //     top: 0,
            //     //     left: 0,
            //     //     width: '100%',
            //     //     height: 'calc(100% - 14px)',
            //     //     paddingLeft: '80px'
            //     // })
            // ], {optional: true}),
            // query(':enter', 
            // [
            //     style(
            //     {
            //         opacity: 0.1
            //     })
            // ], {optional: true}),
            // // query(':leave', animateChild(), {optional: true}),
            // group(
            // [
            //     query(':leave', 
            //     [
            //         animate('3800ms ease-in-out', style(
            //         {
            //             opacity: 0.1
            //         }))
            //     ], {optional: true}),
            //     query(':enter', 
            //     [
            //         animate('3800ms ease-in-out', style(
            //         {
            //             opacity: 1
            //         }))
            //     ], {optional: true})
            // ])
            // query(':enter', animateChild(), {optional: true})
        ])
    ])
]);