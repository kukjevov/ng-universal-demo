import {globalDefine} from '@jscrpt/common';
import {LocalStorage} from 'node-localstorage';

globalDefine(global =>
{
    if(!global.Konami)
    {
        global.Konami = function(){};
    }

    if(!global.Document)
    {
        global.Document = function(){};
    }

    if(!global.FocusEvent)
    {
        global.FocusEvent = function(){};
    }

    if(!global.MouseEvent)
    {
        global.MouseEvent = function(){};
    }

    if(!global.localStorage)
    {
        global.localStorage = new LocalStorage('./serverLocalStorage');
    }
});