import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

import {NgSelectOption} from "./option.interface";

/**
 * Component used for options in select component
 */
@Component(
{
    selector: 'ng-select option',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<TValue> implements NgSelectOption<TValue>
{
    //######################### public properties - template bindings #########################

    /**
     * Indication whether is item active
     */
    public active: boolean = false;

    /**
     * Indication whether this option is selected
     */
    public selected: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Value that will be used if this option will be selected
     */
    @Input()
    public value: TValue;

    /**
     * Text that is displayed if this value is selected
     */
    @Input()
    public text: string;
    
    //######################### public properties #########################

    /**
     * If specified this option will be displayed in group
     */
    public group: string = null;
}