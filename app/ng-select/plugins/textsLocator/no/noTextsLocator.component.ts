import {Component, ChangeDetectionStrategy, ElementRef, EventEmitter, Inject, Optional} from "@angular/core";

import {NgSelectPluginGeneric} from "../../../misc";
import {NgSelectPluginInstances, NG_SELECT_PLUGIN_INSTANCES} from "../../../components/select";
import {NoTextsLocatorOptions, NoTextsLocator} from "./noTextsLocator.interface";

/**
 * Component used for rendering no texts locator
 */
@Component(
{
    selector: 'ng-no-texts-locator',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoTextsLocatorComponent implements NoTextsLocator, NgSelectPluginGeneric<NoTextsLocatorOptions>
{
    //######################### public properties - implementation of TextsLocator #########################

    /**
     * Options for NgSelect plugin
     */
    public options: NoTextsLocatorOptions;

    /**
     * Indication that texts should be obtained again, because they have changed
     */
    public textsChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef)
    {
    }

    //######################### public methods - implementation of TextsLocator #########################

    /**
     * Gets text for specified key
     */
    public getText(key: string): string
    {
        return key;
    }

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
    }

    /**
     * Initialize plugin options, all operations required to be done with plugin options are handled here
     */
    public initOptions()
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}