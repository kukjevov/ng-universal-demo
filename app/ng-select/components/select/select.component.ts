import {Component, ChangeDetectionStrategy} from "@angular/core";

/**
 * Component that represents NgSelect itself, allows selection of value from options
 */
@Component(
{
    selector: 'ng-select',
    templateUrl: 'select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgSelectComponent<TValue>
{
}