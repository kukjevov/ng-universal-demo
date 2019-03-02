import {Component, ChangeDetectionStrategy} from "@angular/core";

import {BasicNormalStateComponent, ReadonlyStateOptions, NgSelectPluginGeneric, ReadonlyState} from "../../../ng-select";

/**
 * Custom readonly state component
 */
@Component(
{
    selector: 'custom-readonly-state',
    templateUrl: 'customReadonlyState.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomReadonlyStateComponent extends BasicNormalStateComponent implements ReadonlyState, NgSelectPluginGeneric<ReadonlyStateOptions<any>>
{
}