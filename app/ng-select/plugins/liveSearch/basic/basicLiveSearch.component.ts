import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, ViewChild} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicLiveSearchOptions, BasicLiveSearch} from './basicLiveSearch.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {LIVE_SEARCH_OPTIONS} from '../liveSearch.interface';

/**
 * Default options for live search
 * @internal
 */
const defaultOptions: BasicLiveSearchOptions =
{
    cssClasses:
    {
    }
};

/**
 * Component used for obtaining basic live search html element
 */
@Component(
{
    selector: "ng-basic-live-search",
    templateUrl: 'basicLiveSearch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
    ]
})
export class BasicLiveSearchComponent implements BasicLiveSearch, NgSelectPluginGeneric<BasicLiveSearchOptions>
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicLiveSearchOptions;

    //######################### public properties - implementation of BasicLiveSearch #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicLiveSearchOptions
    {
        return this._options;
    }
    public set options(options: BasicLiveSearchOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * HTML element that represents live search
     */
    public get liveSearchElement(): HTMLElement
    {
        return this.liveSearchElementChild.nativeElement;
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
                @Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: BasicLiveSearchOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of BasicLiveSearch #########################

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
        this._changeDetector.detectChanges();
    }

    //######################### public methods - template bindings #########################

    /**
     * 
     * @param value 
     * @internal
     */
    public handleInput(value: string)
    {
        console.log(value);
    }
}