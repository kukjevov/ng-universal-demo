import {Component, ChangeDetectionStrategy, Optional} from "@angular/core";
import {Test} from "./provider";

@Component(
{
    selector: 'lazy-component',
    template: 
    `<div (click)="toggle()">TEST LAZY COMPONENT</div>
    <div *ngIf="cond">Inside IF</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyComponent
{
    cond = false;

    toggle()
    {
        this.cond = !this.cond;
    }

    constructor(@Optional() test: Test)
    {
        console.log('test', test);
    }
}