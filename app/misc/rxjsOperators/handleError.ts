import {Injector} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {LOGGER} from '@anglr/common';
import {GlobalNotificationsService} from '@anglr/notifications';
import {isString} from '@jscrpt/common';
import {catchError} from 'rxjs/operators';
import {Observable, MonoTypeOperatorFunction, EMPTY} from 'rxjs';

import {config} from '../../config';

/**
 * Handles errors
 * @param injector - Injector used for injecting dependencies
 */
export function handleError<T>(injector: Injector): MonoTypeOperatorFunction<T>
{
    const notifications = injector.get(GlobalNotificationsService);
    const logger = injector.get(LOGGER);

    return (source: Observable<T>) =>
    {
        return source.pipe(catchError((error: HttpErrorResponse) =>
        {
            logger.debug('handleError: Handled error {@error}', error);

            if(isString(error.error?.error))
            {
                notifications.error(error.error.error);
            }
            else
            {
                if(config.configuration.debug)
                {
                    notifications.error(`Neočakávaná chyba, status: ${error.status}, ${JSON.stringify(error.error)}, original: ${error}`);
                }
                else
                {
                    notifications.error('Neočakávaná chyba');
                }
            }

            return EMPTY;
        }));
    };
}