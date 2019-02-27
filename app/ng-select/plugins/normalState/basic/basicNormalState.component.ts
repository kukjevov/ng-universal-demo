import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicNormalStateOptions, BasicNormalState} from './basicNormalState.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {NORMAL_STATE_OPTIONS} from '../normalState.interface';

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: BasicNormalStateOptions =
{
    nothingSelectedText: 'Nič nevybraté'
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
    }

    //######################### public methods - implementation of BasicNormalState #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        this.invalidateVisuals();
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