import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Custom component test
 */
@Component(
{
    selector: 'custom',
    templateUrl: 'custom.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSAComponent
{
}