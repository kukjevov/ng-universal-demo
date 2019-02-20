import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@asseco/common';

import {OptionComponent} from '../components/option/option.component';

/**
 * Pipe to transform ng select selected option into
 */
@Pipe({name: 'ngSelectValue'})
export class NgSelectValuePipe<TValue> implements PipeTransform
{
    //######################### public methods #########################
    
    /**
     * Transforms selected option into string
     * @param {OptionComponent<TValue>|Array<OptionComponent<TValue>>} options Selected options to be transformed into text
     * @param {string} nothingSelectedText Text displayed if nothing is selected
     */   
    public transform(options: OptionComponent<TValue>|Array<OptionComponent<TValue>>, nothingSelectedText: string): string
    {
        if(isBlank(options) || (Array.isArray(options) && !options.length))
        {
            return nothingSelectedText;
        }

        if(Array.isArray(options))
        {
            return options.map(option => option.text).join(', ');
        }

        return options.text;
    }
}

