import {InjectionToken, EventEmitter} from "@angular/core";

import {PluginOptions, NgSelectPlugin} from "../../misc";

/**
 * Constant used for accessing texts locator plugin in NgSelect
 */
export const TEXTS_LOCATOR = "TEXTS_LOCATOR";

/**
 * Token for injecting options for texts locator plugin
 */
export const TEXTS_LOCATOR_OPTIONS: InjectionToken<TextsLocatorOptions> = new InjectionToken<TextsLocatorOptions>('TEXTS_LOCATOR_OPTIONS');

/**
 * Options for text locator plugin
 */
export interface TextsLocatorOptions extends PluginOptions
{
}

/**
 * Public API for texts locator
 */
export interface TextsLocator extends NgSelectPlugin
{
    /**
     * Indication that texts should be obtained again, because they have changed
     */
    textsChange: EventEmitter<void>;

    /**
     * Gets text for specified key
     */
    getText(key: string): string;
}