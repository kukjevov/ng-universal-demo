import {isFunction, isBlank, initializeAceDevMode, globalDefine} from '@asseco/common';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import * as config from 'config/global';

initializeAceDevMode();

globalDefine(global =>
{
    if(isBlank(global['isElectron']))
    {
        global['isElectron'] = false;
    }

    if(isBlank(global['isPopup']))
    {
        global['isPopup'] = false;
    }

    if(isBlank(global['envName']))
    {
        global['envName'] = 'WEB';
    }

    if(isBlank(global['rendererLogger']))
    {
        global['rendererLogger'] = {log:() => {}};
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