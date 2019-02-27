import {LiveSearch, LiveSearchOptions} from "../liveSearch.interface";

/**
 * No live search options
 */
export interface NoLiveSearchOptions extends LiveSearchOptions<any>
{
}

/**
 * Public API for 'NoLiveSearchComponent'
 */
export interface NoLiveSearch extends LiveSearch
{
}