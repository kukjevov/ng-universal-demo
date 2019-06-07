import {Component, ChangeDetectionStrategy, ValueProvider, SkipSelf, Optional} from "@angular/core";

import {ProvideClass, Test} from "../provider";

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
                @SkipSelf() parentProvideClass: ProvideClass,
                @Optional() test: Test)
    {
        console.log(provideClass);
        console.log(parentProvideClass);
        console.log('sel', test);
    }
}