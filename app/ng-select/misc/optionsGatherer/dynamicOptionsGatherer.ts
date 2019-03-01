import {EventEmitter} from "@angular/core";
import {isPresent, isBlank} from "@asseco/common";
import {Subscription, Observable} from "rxjs";
import {debounceTime} from "rxjs/operators";

import {OptionsGatherer} from "./optionsGatherer.interface";
import {NgSelectPluginInstances} from "../../components/select";
import {NgSelectOption} from "../../components/option";
import {DynamicOptionsGathererOptions} from "./dynamicOptionsGatherer.interface";
import {LIVE_SEARCH, LiveSearch} from "../../plugins/liveSearch";

/**
 * Class that is used as for options gathering in dynamic way, for example from external source when writing
 */
export class DynamicOptionsGatherer<TValue> implements OptionsGatherer<TValue>
{
    //######################### protected fields #########################

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    /**
     * Subscription for changes of live search value
     */
    protected _searchValueChangeSubscription: Subscription;

    /**
     * Minimal number of characters required for searching
     */
    protected _minLength: number = 2;

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of provided options for select
     */
    public options: NgSelectOption<TValue>[] = [];

    /**
     * Occurs when array of provided options has changed
     */
    public optionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Array of visible, displayed options for select
     */
    public get availableOptions(): NgSelectOption<TValue>[]
    {
        return this.options;
    }

    /**
     * Occurs when array of visible, displayed options has changed
     */
    public get availableOptionsChange(): EventEmitter<void>
    {
        return this.optionsChange;
    }

    /**
     * NgSelect plugin instances available for gatherer
     */
    public ngSelectPlugins: NgSelectPluginInstances;

    //######################### constructor #########################
    constructor(protected _options: DynamicOptionsGathererOptions<TValue>)
    {
        if(!this._options)
        {
            throw new Error("Options can not be null!");
        }

        if(this._options && isPresent(this._options.minLength))
        {
            this._minLength = this._options.minLength;
        }
    }

    //######################### public methods - implementation of OptionsGatherer #########################

    /**
     * Initialize gatherer during initialization phase
     */
    public initializeGatherer(): void
    {
        let liveSearch = this.ngSelectPlugins[LIVE_SEARCH] as LiveSearch;

        if(this._liveSearch && this._liveSearch != liveSearch)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;

            this._liveSearch = null;
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;

            let searchValueChange: Observable<void> = this._liveSearch.searchValueChange;

            if(this._options.delay)
            {
                searchValueChange = searchValueChange.pipe(debounceTime(this._options.delay));
            }

            this._searchValueChangeSubscription = searchValueChange.subscribe(async () =>
            {
                if(isBlank(this._liveSearch.searchValue) || this._liveSearch.searchValue.length < this._minLength)
                {
                    this.options = [];
                    this.optionsChange.emit();

                    return;
                }

                this.options = await this._options.dynamicOptionsCallback(this._liveSearch.searchValue);
                this.optionsChange.emit();
            });
        }
    }

    /**
     * Called when gatherer needs to be destroyed
     */
    public destroyGatherer(): void
    {
        if(this._searchValueChangeSubscription)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;
        }
    }
}