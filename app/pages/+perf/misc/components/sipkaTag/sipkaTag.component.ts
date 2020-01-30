import {Component, Input, ChangeDetectionStrategy} from "@angular/core";

/**
 * Component used for displaying 'sipka' tag in Mosia
 */
@Component(
{
    selector: 'sipka-tag',
    templateUrl: 'sipkaTag.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SipkaTagComponent
{
    //######################### public properties - inputs #########################

    /**
     * Value that will be displayed as 'sipka'
     */
    @Input()
    public value?: number;
}