import {Injectable} from '@angular/core';

/**
 * Service used for storing redirect location header when 401 http code received
 */
@Injectable({providedIn: 'root'})
export class RedirectLocationService
{
    //######################### public properties #########################

    /**
     * Location used for redirection
     */
    public location: string;
}