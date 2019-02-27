import {LiveSearch, LiveSearchOptions} from "../liveSearch.interface";

/**
 * Css classes for basic live search
 */
export interface CssClassesBasicLiveSearch
{
}

/**
 * Basic live search options
 */
export interface BasicLiveSearchOptions extends LiveSearchOptions<CssClassesBasicLiveSearch>
{
}

/**
 * Public API for 'BasicLiveSearchComponent'
 */
export interface BasicLiveSearch extends LiveSearch
{
}