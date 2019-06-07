import {Component, ChangeDetectionStrategy, Optional} from "@angular/core";
import {Test} from "./provider";

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

    constructor(@Optional() test: Test)
    {
        console.log('test2', test);
    }

    add()
    {
        this.array.push(this.array.length);
    }
}