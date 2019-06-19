import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

/**
 * Select sample component
 */
@Component(
{
    selector: 'select-view',
    templateUrl: 'select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class SelectPageComponent
{
    //######################### public properties - template bindings #########################

    /**
     * Array of lazy options
     */
    public lazyOptions: {kod: string, popis: string}[] = [];

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
        setTimeout(() =>
        {
            this.lazyOptions = 
            [
                {
                    kod: 'first-x',
                    popis: 'First value text'
                },
                {
                    kod: 'second-x',
                    popis: 'Second value text'
                },
                {
                    kod: 'third-x',
                    popis: 'Third value text'
                },
                {
                    kod: 'fourth-x',
                    popis: 'Fourth value text'
                },
                {
                    kod: 'fifth-x',
                    popis: 'Fifth value text'
                }
            ];

            this._changeDetector.detectChanges();
        }, 2500);
    }
}
