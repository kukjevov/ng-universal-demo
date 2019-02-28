import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicValueHandlerOptions, BasicValueHandler} from './basicValueHandler.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {VALUE_HANDLER_OPTIONS} from '../valueHandler.interface';

/**
 * Default options for value handler
 * @internal
 */
const defaultOptions: BasicValueHandlerOptions =
{
};

/**
 * Component used for handling current value of NgSelect
 */
@Component(
{
    selector: "ng-basic-value-handler",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicValueHandlerComponent implements BasicValueHandler, NgSelectPluginGeneric<BasicValueHandlerOptions>
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicValueHandlerOptions;

    //######################### public properties - implementation of BasicValueHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicValueHandlerOptions
    {
        return this._options;
    }
    public set options(options: BasicValueHandlerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: BasicValueHandlerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of BasicValueHandler #########################

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