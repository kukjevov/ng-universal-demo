import {Component, ChangeDetectionStrategy} from "@angular/core";

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
}