import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicNormalStateOptions, BasicNormalState} from './basicNormalState.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {NORMAL_STATE_OPTIONS, NormalStateTexts} from '../normalState.interface';
import {TextsLocator, TEXTS_LOCATOR} from '../../textsLocator';

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: BasicNormalStateOptions =
{
    texts:
    {
        nothingSelected: 'Nothing selected'
    }
};

/**
 * Component used for rendering basic simple normal state of select
 */
@Component(
{
    selector: "div.normal-state",
    templateUrl: 'basicNormalState.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
    ]
})
export class BasicNormalStateComponent implements BasicNormalState, NgSelectPluginGeneric<BasicNormalStateOptions>
{
    //######################### private fields #########################

    /**
     * Texts locator used for handling texts
     */
    private _textsLocator: TextsLocator;

    /**
     * Subscription for changes in texts
     */
    private _textsChangedSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    private _options: BasicNormalStateOptions;

    //######################### public properties - implementation of BasicNormalState #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicNormalStateOptions
    {
        return this._options;
    }
    public set options(options: BasicNormalStateOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### public properties - template bindings #########################

    /**
     * Object containing available texts
     * @internal
     */
    public texts: NormalStateTexts = {};

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                private _changeDetector: ChangeDetectorRef,
                @Inject(NORMAL_STATE_OPTIONS) @Optional() options?: BasicNormalStateOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._textsChangedSubscription)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicNormalState #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        let textsLocator: TextsLocator = this.ngSelectPlugins[TEXTS_LOCATOR] as TextsLocator;

        if(this._textsLocator && this._textsLocator != textsLocator)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;

            this._textsLocator = null;
        }

        if(!this._textsLocator)
        {
            this._textsLocator = textsLocator;

            this._textsChangedSubscription = this._textsLocator.textsChange.subscribe(() => this._initTexts());
        }

        this._initTexts();
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

    //######################### private methods #########################

    /**
     * Initialize texts
     */
    private _initTexts()
    {
        Object.keys(this.options.texts).forEach(key =>
        {
            this.texts[key] = this._textsLocator.getText(this.options.texts[key]);
        });

        this._changeDetector.detectChanges();
    }
}