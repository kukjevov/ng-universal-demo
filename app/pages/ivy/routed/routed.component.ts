import {Component, ChangeDetectionStrategy} from "@angular/core";
import {ComponentRoute} from "@ng/common";

@Component(
{
    selector: 'routed-component',
    templateUrl: 'routed.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'routed'})
export class RoutedComponent
{
    public visible: boolean = false;
}