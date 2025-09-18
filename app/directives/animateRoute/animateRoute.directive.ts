import {Directive, OnDestroy, signal, WritableSignal} from '@angular/core';
import {EventType, Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AnimateRouteService} from '../../services/animatRoute';

/**
 * Directive that is used for animating route transitions
 */
@Directive(
{
    selector: '[animateRoute]',
    host:
    {
        '[animate.enter]': '["page-animation", animateEnter()]',
        '[animate.leave]': '["page-animation", animateLeave()]',
    },
})
export class AnimateRouteDirective implements OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscriptions created during initialization
     */
    private _initSubscriptions: Subscription = new Subscription();

    //######################### protected properties - host #########################

    /**
     * Name of animation for leave
     */
    protected animateLeave: WritableSignal<string> = signal('fade-out');

    /**
     * Name of animation for enter
     */
    protected animateEnter: WritableSignal<string> = signal('fade-in');

    //######################### constructor #########################
    constructor(router: Router,
                animateRouteSvc: AnimateRouteService,)
    {
        this.animateEnter.set(animateRouteSvc.enterAnimation());

        this._initSubscriptions.add(router.events.subscribe(event =>
        {
            if(event.type == EventType.NavigationStart)
            {
                if(event.url == '/login')
                {
                    this.animateLeave.set('fly-out');
                    animateRouteSvc.enterAnimation.set('fly-in');
                }
                else
                {
                    animateRouteSvc.enterAnimation.set('fade-in');
                }
            }
            else if(event.type == EventType.ResolveEnd)
            {
                if(router.currentNavigation()?.previousNavigation?.finalUrl?.toString() == '/login')
                {
                    this.animateLeave.set('fly-out');
                    animateRouteSvc.enterAnimation.set('fly-in');
                }
            }
        }));
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this._initSubscriptions.unsubscribe();
    }
}
