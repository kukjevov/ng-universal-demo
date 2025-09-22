import {Component, ChangeDetectionStrategy} from '@angular/core';

import {AnimateDirective} from '../../directives/animate/animate.directive';

/**
 * Component
 */
@Component(
{
    selector: 'div.test',
    templateUrl: 'ab.component.html',
    hostDirectives:
    [
        AnimateDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbComponent
{
}
