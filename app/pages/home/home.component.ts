import {Component, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {trigger, transition, style, animate, query, animateChild} from '@angular/animations';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations:
    [
        trigger('slowFade',
        [
            transition('void => *',
            [
                style(
                {
                    opacity: 0
                }),
                animate(1000, style(
                {
                    opacity: 1
                }))
            ]),
            transition('* => void',
            [
                animate(1000, style(
                {
                    opacity: 0
                }))
            ])
        ]),
        trigger('componentContent',
        [
            transition(':enter, :leave',
            [
                query('@*', animateChild())
            ])
        ])
    ]
})
export class HomeComponent
{
    @HostBinding('@componentContent')
    public animation: boolean = true;
}
