import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, ViewChild} from '@angular/core';

import {NoLiveSearchOptions, NoLiveSearch} from './noLiveSearch.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {DOCUMENT} from '@angular/common';

/**
 * Component used for no live search
 */
@Component(
{
    selector: "ng-no-live-search",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoLiveSearchComponent implements NoLiveSearch, NgSelectPluginGeneric<NoLiveSearchOptions>
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: NoLiveSearchOptions;

    //######################### public properties - implementation of NoLiveSearch #########################

    /**
     * Options for NgSelect plugin
     */
    public options: NoLiveSearchOptions;

    /**
     * HTML element that represents live search
     */
    public get liveSearchElement(): HTMLElement
    {
        return this._document.createElement("span");
    }

    //######################### public properties - children #########################

    /**
     * View child that represents live search element
     * @internal
     */
    @ViewChild('liveSearchElement')
    public liveSearchElementChild: ElementRef<HTMLElement>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(DOCUMENT) private _document: HTMLDocument)
    {
    }

    //######################### public methods - implementation of NoLiveSearch #########################

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