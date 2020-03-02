import {Component, ChangeDetectionStrategy} from "@angular/core";

/**
 * Example component
 */
@Component(
{
    selector: 'example',
    templateUrl: 'example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent
{
}