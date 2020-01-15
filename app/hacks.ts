import {isFunction, isBlank, initializeJsDevMode, globalDefine} from '@jscrpt/common';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import * as config from 'config/global';

initializeJsDevMode();

globalDefine(global =>
{
    if(!global.HTMLDocument)
    {
        global.HTMLDocument = function(){};
    }
});

//HACK - prevents application crash if no error handler provided
var observableSubscribe = Observable.prototype.subscribe;

Observable.prototype.subscribe = <any>function(next, error, complete)
{
    if(isBlank(error) || !isFunction(error))
    {
        error = (err) => 
        {
            if(config.debug)
            {
                console.log(err);
            }
        };
    }

    return observableSubscribe.call(this, next, error, complete);
};

//HACK - local time interpreted as UTF
var momentToJSON = moment.prototype.toJSON;

moment.prototype.toJSON = function ()
{
    let newMoment: moment.Moment = moment(this);
    newMoment.add(this.utcOffset(), 'minutes');

    return momentToJSON.call(newMoment);
}