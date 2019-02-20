import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

/**
 * Component used for options in select component
 */
@Component(
{
    selector: 'ng-select>option',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionComponent<TValue>
{
    //######################### public properties - template bindings #########################

    /**
     * Indication whether is item active
     */
    public active?: boolean = false;

    /**
     * Indication whether this option is selected
     */
    public selected?: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Value of option
     */
    @Input()
    public value: TValue;

    /**
     * Text to be displayed for this value
     */
    @Input()
    public text: string;
}