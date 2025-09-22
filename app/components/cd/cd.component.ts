import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Component
 */
@Component(
{
    selector: 'div.cd',
    templateUrl: 'cd.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdComponent
{
}
