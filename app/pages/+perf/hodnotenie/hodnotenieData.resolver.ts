import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

import {HodnotenieDetail, HodnotenieService} from "../../../services/api/hodnotenie";

/**
 * Used as indicator that state is changing
 */
export class HodnotenieStateChanging
{
    /**
     * Indication whether state is changing
     */
    changing: boolean = false;
}

/**
 * Resolver that resolves data for detail of 'mosia' before displaying it
 */
@Injectable()
export class HodnotenieDataResolver implements Resolve<HodnotenieDetail>
{
    //######################### constructor #########################
    constructor(private _hodnotenieSvc: HodnotenieService,
                private _hodnotenieStateChanging: HodnotenieStateChanging)
    {
    }

    //######################### implementation of Resolve<PrehladHospCookieData> #########################

    /**
     * Resolves data for 'mosia' detail
     * @param {ActivatedRouteSnapshot} route Next route that will be resolved
     * @param {RouterStateSnapshot} state Current state of router
     */
    public async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<HodnotenieDetail> 
    {
        if(this._hodnotenieStateChanging.changing)
        {
            return null;
        }

        let urlid = route.params['id'];

        let id = urlid.replace(/^(.*)-.*?$/, "$1");
        let obdobie = urlid.replace(/^.*-(.*?)$/, "$1");

        let data = await this._hodnotenieSvc
            .getDetail(`${id}-${obdobie}`)
            .toPromise();

        return data;
    }
}