import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicPopupOptions, BasicPopup} from './basicPopup.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {POPUP_OPTIONS} from '../popup.interface';

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
export class BasicPopupComponent implements BasicPopup, NgSelectPluginGeneric<BasicPopupOptions>
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPopupOptions;

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

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: BasicPopupOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of BasicPopup #########################

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
}