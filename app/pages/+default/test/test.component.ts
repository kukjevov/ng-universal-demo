import {Component, ChangeDetectionStrategy} from '@angular/core';
import {JsonPipe} from '@angular/common';

/**
 * Test component
 */
@Component(
{
    selector: 'test',
    templateUrl: 'test.component.html',
    standalone: true,
    imports:
    [
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent
{
}