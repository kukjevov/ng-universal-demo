import {NgSelectOption} from "../../components/option";

/**
 * Callback used for obtaining dynamic options
 */
export interface GetOptionsCallback<TValue>
{
    /**
     * Gets array of options based on query
     * @param query Query for obtaining options, can be searched string or TValue in case of obtaining option for value during initialization
     */
    (query: string|TValue): Promise<NgSelectOption<TValue>[]>;
}

/**
 * Options for dynamic options gatherer
 */
export interface DynamicOptionsGathererOptions<TValue>
{
    /**
     * Callback used for obtaining dynamic options
     */
    dynamicOptionsCallback: GetOptionsCallback<TValue>;

    /**
     * Number of miliseconds which represents minimal delay between calls of dynamicOptionsCallback
     */
    delay?: number;

    /**
     * Minimal number of characters to be used for searching
     */
    minLength?: number;
}