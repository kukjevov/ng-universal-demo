import {Component, ChangeDetectionStrategy} from "@angular/core";

@Component(
{
    selector: 'lazy2-component',
    template: 
    `<button (click)="add()">add</button>
    <div *ngFor="let itm of array">***{{itm}}***</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Lazy2Component
{
    array: number[] = [];

    add()
    {
        this.array.push(this.array.length);
    }
}