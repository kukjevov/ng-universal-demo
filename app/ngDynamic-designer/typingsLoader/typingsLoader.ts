import {Injectable} from "@angular/core";

/**
 * Class used for loading typings for typescript code editor
 */
@Injectable({providedIn: 'root'})
export class TypingsLoader
{
    //######################### public methods #########################

    /**
     * Gets typings for specified reference
     * @param referenceName Name of reference for which are typings get
     */
    public getTypings(referenceName: string): string
    {
        switch(referenceName)
        {
            case 'rxjs':
            {
                return require('./rxjs.typings');
            }
            case 'rxjs/operators':
            {
                return require('./rxjs-operators.typings');
            }
            case 'moment':
            {
                return require('./moment.typings');
            }
        }

        return '';
    }
}