import {isBlank} from "@asseco/common";

declare global 
{
    const aceDevMode: boolean;
}

(function(global: any) 
{
    if(isBlank(global.aceDevMode))
    {
        global.aceDevMode = false;
    }
})(typeof window != 'undefined' && window || typeof self != 'undefined' && self || typeof global != 'undefined' && global);