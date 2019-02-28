import {Type, ElementRef} from "@angular/core";

import {NgSelectPluginInstances} from "../components/select";
import {KeyboardHandler} from "../plugins/keyboardHandler";
import {NormalState} from "../plugins/normalState";
import {Popup} from "../plugins/popup";
import {Positioner} from "../plugins/positioner";
import {ReadonlyState} from "../plugins/readonlyState";
import {ValueHandler} from "../plugins/valueHandler";
import {LiveSearch} from "../plugins/liveSearch";
import {TextsLocator} from "../plugins/textsLocator";

/**
 * NgSelect plugin interface
 */
export interface NgSelectPlugin
{
    /**
     * NgSelect plugin instances available for this plugin
     */
    ngSelectPlugins: NgSelectPluginInstances;

    /**
     * Element that represents plugin
     */
    pluginElement: ElementRef;

    /**
     * Options for NgSelect plugin
     */
    options: any;

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    initialize();

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    initOptions();

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}

/**
 * NgSelect plugin generic interface
 */
export interface NgSelectPluginGeneric<TOptions> extends NgSelectPlugin
{
    /**
     * Options for ng select plugin
     */
    options: TOptions;
}

/**
 * All available types of plugins for NgSelect
 */
export class NgSelectPluginTypes
{
    /**
     * Handles keyboard events
     */
    keyboardHandler?: PluginDescription<KeyboardHandler>;

    /**
     * Component used for displaying normal state of select
     */
    normalState?: PluginDescription<NormalState>;

    /**
     * Component used for displaying available options for selection
     */
    popup?: PluginDescription<Popup>;

    /**
     * Handles correct position of pop component
     */
    positioner?: PluginDescription<Positioner>;

    /**
     * Component used for displaying readonly/disabled state of select, can be null, in that case normal state component is used
     */
    readonlyState?: PluginDescription<ReadonlyState>;

    /**
     * Handles obtaining and setting value of component
     */
    valueHandler?: PluginDescription<ValueHandler<any>>;

    /**
     * Contains component that is used for live searching in options
     */
    liveSearch?: PluginDescription<LiveSearch>;

    /**
     * Used for obtaining texts that are displayed in NgSelect
     */
    textsLocator?: PluginDescription<TextsLocator>;
}

/**
 * Base options for every plugin
 */
export interface PluginOptions
{
}

/**
 * Base options for every visual plugin (component)
 */
export interface VisualPluginOptions<TCssClasses> extends PluginOptions
{
    /**
     * Css classes applied to visual plugin (component), possible to override only part of classes
     */
    cssClasses?: TCssClasses;
}

/**
 * Defines interface, that describes minimal set of parameters for specifying plugin for NgSelect
 */
export interface PluginDescription<PluginType>
{
    /**
     * Type of plugin that will be dynamically instantiated
     */
    type?: Type<PluginType>;

    /**
     * Options that will be passed to dynamically instantiated plugin
     */
    options?: PluginOptions;

    /**
     * Optional callback used for obtaining dynamic instance of plugin (allows direct communication with plugin)
     */
    instanceCallback?: (instance: PluginType|null) => void;
}