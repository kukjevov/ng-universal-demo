import {LiveSearch, LiveSearchOptions} from "../liveSearch.interface";

/**
 * Css classes for basic live search
 */
export interface CssClassesBasicLiveSearch
{
    /**
     * Applied to wrapper div around input
     */
    wrapperDiv?: string;

    /**
     * Applied to input that represents live search
     */
    input?: string;
}

/**
 * Basic live search options
 */
export interface BasicLiveSearchOptions extends LiveSearchOptions<CssClassesBasicLiveSearch>
{
    /**
     * Indication whether keep search value after popup close
     */
    keepSearchValue?: boolean;
}

/**
 * Public API for 'BasicLiveSearchComponent'
 */
export interface BasicLiveSearch extends LiveSearch
{
}