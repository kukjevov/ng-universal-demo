import {Pipe, PipeTransform} from '@angular/core';
import {isBlank} from '@asseco/common';
import {PropertiesPropertyMetadata} from '../../../../interfaces';

/**
 * Pipe to filter out hidden properties
 */
@Pipe({name: 'onlyVisible'})
export class OnlyVisiblePipe implements PipeTransform
{
    //######################### public methods #########################
    
    /**
     * Filters out hidden properties
     * @param properties Properties to be filtered
     */   
    public transform(properties: PropertiesPropertyMetadata[]): PropertiesPropertyMetadata[]
    {
        if(isBlank(properties))
        {
            return [];
        }

        return properties.filter(itm => !itm.hidden);
    }
}

