import {EventEmitter} from "@angular/core";

import {NgSelectOption} from "../components/option/option.interface";

/**
 * Gatherer used for obtaining options for select
 */
export interface OptionsGatherer<TValue>
{
    /**
     * Array of provided options for select
     */
    readonly options?: NgSelectOption<TValue>[];

    /**
     * Occurs when array of provided options has changed
     */
    readonly optionsChange: EventEmitter<void>;
}