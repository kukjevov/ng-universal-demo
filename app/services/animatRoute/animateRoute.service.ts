import {Injectable, signal, WritableSignal} from '@angular/core';

/**
 * Service used for obtaining proper animation for route
 */
@Injectable({providedIn: 'root'})
export class AnimateRouteService
{
    //######################### public properties #########################

    /**
     * Name of animation to be used for entering view
     */
    public enterAnimation: WritableSignal<string> = signal('page-fade-in');
}
