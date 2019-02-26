import {Component, ChangeDetectionStrategy, Input, EventEmitter, QueryList, ViewChildren, AfterViewInit} from "@angular/core";

import {NgSelectOptGroup} from "./optgroup.interface";
import {NgSelectOption} from "./option.interface";
import {OptionComponent} from "./option.component";

/**
 * Component used for options group in select component
 */
@Component(
{
    selector: 'ng-select>optgroup',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptGroupComponent<TValue> implements NgSelectOptGroup<TValue>, AfterViewInit
{
    //######################### private fields #########################

    /**
     * Instance of event emitter for optionsChange
     */
    private _optionsChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties #########################

    /**
     * Options assigned to this options group
     */
    public get options(): NgSelectOption<TValue>[]
    {
        return this.optionsChildren.toArray();
    }

    /**
     * Occurs when options in this group change
     */
    public get optionsChange(): EventEmitter<void>
    {
        return this._optionsChange;
    }

    //######################### public properties - children #########################

    /**
     * Children options in this group
     * @internal
     */
    @ViewChildren(OptionComponent)
    public optionsChildren: QueryList<NgSelectOption<TValue>>;

    //######################### public properties - inputs #########################

    /**
     * Text that is displayed for this options group
     */
    @Input()
    public text: string;

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this.optionsChildren.changes.subscribe(() =>
        {
            this._optionsChange.emit();
        });
    }
}