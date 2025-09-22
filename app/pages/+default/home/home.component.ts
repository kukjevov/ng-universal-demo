import {Component, ChangeDetectionStrategy, WritableSignal, signal, Signal, viewChild, ViewContainerRef, inputBinding} from '@angular/core';
import {ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, ComponentRouteAuthorized} from '@anglr/authentication';
import {DebugDataCopyClickModule} from '@anglr/common/material';
import {TooltipDirective, WithScrollableCssClass} from '@anglr/common';

import {AnimateRouteDirective} from '../../../directives';
import {AnimateDirective} from '../../../directives/animate/animate.directive';
import {AbComponent} from '../../../components/ab/ab.component';
import {CdComponent} from '../../../components/cd/cd.component';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    standalone: true,
    imports:
    [
        DebugDataCopyClickModule,
        AnimateDirective,
        TooltipDirective,
    ],
    hostDirectives:
    [
        AnimateRouteDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRouteAuthorized({path: 'home'})
@Authorize('home-page')
@WithScrollableCssClass()
export class HomeComponent
{
    protected toggle: WritableSignal<boolean> = signal(false);

    protected anim: WritableSignal<string> = signal('fly-in');

    protected viewContainer: Signal<ViewContainerRef> = viewChild.required('div', {read: ViewContainerRef});

    constructor()
    {
    }

    protected click(): void
    {
        if(this.toggle())
        {
            this.viewContainer().createComponent(AbComponent);
            this.viewContainer().createComponent(CdComponent,
            {
                directives:
                [
                    {
                        type: AnimateDirective,
                        bindings:
                        [
                            inputBinding('enterAnim', () => 'fade-in'),
                            inputBinding('leaveAnim', () => 'fade-out'),
                        ],
                    },
                ],
            });
        }
        else
        {
            this.viewContainer().clear();
        }
    }
}
