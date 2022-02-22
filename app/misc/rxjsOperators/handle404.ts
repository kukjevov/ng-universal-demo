import {Observable, MonoTypeOperatorFunction, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * Handles 404 http code as response
 */
export function handle404<TResponse>(): MonoTypeOperatorFunction<TResponse|null>
{
    return (source: Observable<TResponse|null>) =>
    {
        return source.pipe(catchError(error =>
        {
            if(error.status == 404)
            {
                return of(null);
            }

            return throwError(error);
        }));
    };
}