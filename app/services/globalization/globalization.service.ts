import {Injectable} from '@angular/core';
import {GlobalizationService as GlobalizationServiceInterface} from '@anglr/common';
import {Observable, EMPTY} from 'rxjs';

/**
 * Globalization service that is used for obtaining globalization language
 */
@Injectable()
export class GlobalizationService extends GlobalizationServiceInterface
{
    /**
     * Gets current name of locale, that is used within picker
     */
    public get locale(): string
    {
        return 'sk';
    }
    
    /**
     * Gets observable that emits data when locale changes and change should be applied to picker
     */
    public get localeChange(): Observable<void>
    {
        return EMPTY;
    }
}