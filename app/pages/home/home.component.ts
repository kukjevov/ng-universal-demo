import {Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef} from '@angular/core';
import {trigger, transition, style, animate, query, animateChild, group} from '@angular/animations';

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
        trigger("test",
        [
            transition("* => *",
            [
                group(
                [
                    query(":enter",
                    [
                        style({opacity: 0, position: 'absolute', transform: 'translateX(30%)'}),
                        animate(400, style({opacity: 1, transform: 'translateX(0)'}))
                    ], {optional: true}),
                    query(":leave",
                    [
                        style({opacity: 1, position: 'absolute', transform: 'translateX(0)'}),
                        animate(400, style({opacity: 0, transform: 'translateX(-30%)'}))
                    ], {optional: true})
                ]),
            ])
        ]),
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

    public trigger = "in";

    public show: boolean = false;

    public counter = 0;

    public data1: string = "bla bla bla";

    constructor(private _changeDetector: ChangeDetectorRef)
    {
      setTimeout(() =>
        {
            this.data1 = 'ble blo';
            this._changeDetector.detectChanges();
            console.log('value is different');
        }, 5000);

    }

    public increment()
    {
        this.data1 = `blaaaa ${++this.counter}`;
    }
}
