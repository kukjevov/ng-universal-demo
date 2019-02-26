import {EventEmitter} from "@angular/core";

import {NgSelectOption} from "./option.interface";

/**
 * Option group for ng select
 */
export interface NgSelectOptGroup<TValue>
{
    /**
     * Options assigned to this options group
     */
    readonly options?: NgSelectOption<TValue>[];

    /**
     * Occurs when options in this group change
     */
    readonly optionsChange?: EventEmitter<void>;

    /**
     * Text that is displayed for this options group
     */
    text?: string;
}