import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Notifications sample component
 */
@Component(
{
    selector: 'static-select-view',
    templateUrl: 'staticSelect.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class StaticSelectPageComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Array of lazy options
     */
    public lazyOptions: {kod: string, popis: string}[] = [];

    //######################### constructor #########################
    constructor()
    {
        this.lazyOptions = 
        [
            {
                kod: 'first-q',
                popis: 'First value text'
            },
            {
                kod: 'second-q',
                popis: 'Second value text'
            },
            {
                kod: 'third-q',
                popis: 'Third value text'
            },
            {
                kod: 'fourth-q',
                popis: 'Fourth value text'
            },
            {
                kod: 'fifth-q',
                popis: 'Fifth value text'
            }
        ];
    }
}
