import {Injectable} from '@angular/core';
import {TranslateLoader} from '@ngx-translate/core';
import {Observable, Observer} from 'rxjs';

/**
 * Service used as webpack translate loader
 */
@Injectable()
export class WebpackTranslateLoaderService implements TranslateLoader
{
    //######################### public methods - implementation of TranslateLoader #########################

    /**
     * Gets translations for specified language
     * @param lang Language which translations are required
     */
    public getTranslation(lang: string): Observable<any> 
    {
        return new Observable((observer: Observer<any>) =>
        {
            (async () => 
            {
                const result = await import(`../../../content/l10n/${lang}.json`);
    
                observer.next(result.default);
                observer.complete();
            })();
        });
    }
}