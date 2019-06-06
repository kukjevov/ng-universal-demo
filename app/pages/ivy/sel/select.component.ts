import {Component, ChangeDetectionStrategy, ValueProvider, SkipSelf} from "@angular/core";

import {ProvideClass} from "../provider";

@Component(
{
    selector: 'select-cmp',
    templateUrl: 'select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <ValueProvider>
        {
            provide: ProvideClass,
            useValue:
            {
                value: "my select component value"
            }
        }
    ]
})
export class SelectComponent
{
    constructor(provideClass: ProvideClass,
                @SkipSelf() parentProvideClass: ProvideClass)
    {
        console.log(provideClass);
        console.log(parentProvideClass);
    }
}