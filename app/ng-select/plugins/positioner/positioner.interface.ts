import {InjectionToken} from "@angular/core";

import {PluginOptions, NgSelectPlugin, OptionsGatherer} from "../../misc";

/**
 * Constant used for accessing positioner plugin in NgSelect
 */
export const POSITIONER = "POSITIONER";

/**
 * Token for injecting options for positioner plugin
 */
export const POSITIONER_OPTIONS: InjectionToken<PositionerOptions> = new InjectionToken<PositionerOptions>('POSITIONER_OPTIONS');

/**
 * Options for positioner plugin
 */
export interface PositionerOptions extends PluginOptions
{
    /**
     * Coordinates of options popup relative to select
     */
    optionsCoordinates?: Positions.PositionsCoordinates;

    /**
     * Coordinates of select relative to options
     */
    selectCoordinates?: Positions.PositionsCoordinates;
}

/**
 * Positioner plugin interface
 */
export interface Positioner extends NgSelectPlugin
{
    /**
     * HTML element that represents select itself
     */
    selectElement: HTMLElement;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    optionsGatherer: OptionsGatherer<any>;
}