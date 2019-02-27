import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicPopupOptions, BasicPopup} from './basicPopup.interface';
import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {POPUP_OPTIONS} from '../popup.interface';
import {ɵNgSelectOption} from '../../../components/option';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: BasicPopupOptions =
{
    cssClasses:
    {
    }
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-popup",
    templateUrl: 'basicPopup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
    ]
})
export class BasicPopupComponent<TValue> implements BasicPopup<TValue>, NgSelectPluginGeneric<BasicPopupOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPopupOptions;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicPopupOptions
    {
        return this._options;
    }
    public set options(options: BasicPopupOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<TValue>;

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption<TValue>[];

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: BasicPopupOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.optionsChange.subscribe(() => this.loadOptions());
        }

        this.loadOptions();
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

    //######################### protected methods #########################

    /**
     * Loads options
     */
    protected loadOptions()
    {
        this.selectOptions = this._optionsGatherer.options;
        this._changeDetector.detectChanges();
    }
}