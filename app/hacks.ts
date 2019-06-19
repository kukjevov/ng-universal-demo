import {isFunction, isBlank} from '@asseco/common';
import {Observable} from 'rxjs';

//HACK - prevents application crash if no error handler provided
var observableSubscribe = Observable.prototype.subscribe;

Observable.prototype.subscribe = <any>function(next, error, complete)
{
    if(isBlank(error) || !isFunction(error))
    {
        error = (err) => 
        {
            console.log(err);
        };
    }

    return observableSubscribe.call(this, next, error, complete);
};