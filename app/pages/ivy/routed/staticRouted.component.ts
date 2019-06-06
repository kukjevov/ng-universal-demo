import {Component, ChangeDetectionStrategy} from "@angular/core";

@Component(
{
    selector: 'static-routed-component',
    templateUrl: 'staticRouted.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaticRoutedComponent
{
}