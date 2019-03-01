import {EventEmitter} from "@angular/core";

import {NgSelectOption} from "../../components/option/option.interface";
import {NgSelectPluginInstances} from "../../components/select";

/**
 * Gatherer used for obtaining options for select
 */
export interface OptionsGatherer<TValue>
{
    /**
     * Array of provided options for select
     */
    readonly options: NgSelectOption<TValue>[];

    /**
     * Occurs when array of provided options has changed
     */
    readonly optionsChange: EventEmitter<void>;

    /**
     * Array of visible, displayed options for select
     */
    readonly availableOptions: NgSelectOption<TValue>[];

    /**
     * Occurs when array of visible, displayed options has changed
     */
    readonly availableOptionsChange: EventEmitter<void>;

    /**
     * NgSelect plugin instances available for gatherer
     */
    ngSelectPlugins: NgSelectPluginInstances;

    /**
     * Initialize gatherer during initialization phase
     */
    initializeGatherer(): void;

    /**
     * Called when gatherer needs to be destroyed
     */
    destroyGatherer(): void;
}