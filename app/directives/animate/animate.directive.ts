import {Directive, input, InputSignal} from '@angular/core';

/**
 * Animate directive
 */
@Directive(
{
    selector: '[animate]',
    host:
    {
        '[animate.enter]': 'enterAnim()',
        '[animate.leave]': 'leaveAnim()',
    },
})
export class AnimateDirective
{
    public enterAnim: InputSignal<string|string[]> = input<string|string[]>('fly-in');
    public leaveAnim: InputSignal<string|string[]> = input<string|string[]>('fly-out');
}
