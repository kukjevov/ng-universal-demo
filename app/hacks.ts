import {isFunction, isBlank} from '@jscrpt/common';
import {Observable, Subscription} from 'rxjs';

import {config} from './config';

//HACK - prevents application crash if no error handler provided
const observableSubscribe = Observable.prototype.subscribe;

Observable.prototype.subscribe = function<T>(this: Observable<T>, next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription
{
    if(isBlank(error) || !isFunction(error))
    {
        error = (err) => 
        {
            if(config.configuration.debug)
            {
                console.log(err);
            }
        };
    }

    return observableSubscribe.call(this, next, error, complete);
} as any;