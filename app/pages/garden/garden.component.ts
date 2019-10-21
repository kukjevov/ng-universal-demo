import {Component, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {trigger, transition, style, animate, query, animateChild} from '@angular/animations';
import {Base} from './base';

/**
 * Home component
 */
@Component(
{
    selector: 'garden-view',
    templateUrl: 'garden.component.html',
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
export class GardenComponent extends Base
{
    // @ViewChild(TestWrapper)
    // public child: TestWrapper;

    @HostBinding('@componentContent')
    public animation: boolean = true;

    public condition: boolean = true;
}
