import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {isBlank} from '@asseco/common';

/**
 * Pipe to sanitize css style property
 */
@Pipe({name: 'sanitizeCss'})
export class SanitizeCssPipe implements PipeTransform
{
    //######################### constructor #########################
    constructor(private _sanitizer: DomSanitizer)
    {
    }

    //######################### public methods #########################
    
    /**
     * Transforms css value into correct css value
     * @param {string} value Value to be sanitized
     */   
    public transform(value: string): any
    {
        if(isBlank(value))
        {
            return '';
        }

        return this._sanitizer.bypassSecurityTrustStyle(value);
    }
}

