import {Injector} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StringDictionary} from "@asseco/common";
import {Subscription} from "rxjs";

import {DynamicOutput, NodeDefinition} from "../../ngDynamic-core";
import {DynamicNodeDesignerMetadata} from "../../ngDynamic-designer";

/**
 * Node used for obtaining information about current route
 */
@DynamicNodeDesignerMetadata(
{
    relationsMetadata:
    {
        name: 'Activated route',
        description: 'Currently activated route',
        outputs:
        [
            {
                id: 'query',
                name: 'query',
                type: 'StringDictionary'
            }
        ]
    }
})
export class ActivatedRouteNode implements NodeDefinition
{
    //######################### private fields #########################

    /**
     * Subscription for changes of route query
     */
    private _queryChangesSubscription: Subscription;

    //######################### public properties #########################

    /**
     * Dictionary holding current query params status
     */
    @DynamicOutput()
    public query: StringDictionary = {};

    //######################### constructor #########################
    constructor(injector: Injector)
    {
        let activatedRoute = injector.get(ActivatedRoute);

        this._queryChangesSubscription = activatedRoute.queryParams.subscribe(params =>
        {
            this.query = params;
        });
    }

    //######################### public methods #########################
    
    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }

    /**
     * Destroys everything that should be destroyed and frees memory
     */
    public destroy(): void
    {
        if(this._queryChangesSubscription)
        {
            this._queryChangesSubscription.unsubscribe();
            this._queryChangesSubscription = null;
        }
    }
}