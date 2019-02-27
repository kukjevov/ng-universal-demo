import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicKeyboardHandlerOptions, BasicKeyboardHandler} from './basicKeyboardHandler.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {KEYBOARD_HANDLER_OPTIONS} from '../keyboardHandler.interface';

/**
 * Default options for keyboard handler
 * @internal
 */
const defaultOptions: BasicKeyboardHandlerOptions =
{
};

/**
 * Component used for obtaining basic keyboard handler html element
 */
@Component(
{
    selector: "ng-basic-keyboard-handler",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicKeyboardHandlerComponent implements BasicKeyboardHandler, NgSelectPluginGeneric<BasicKeyboardHandlerOptions>
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicKeyboardHandlerOptions;

    //######################### public properties - implementation of BasicKeyboardHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicKeyboardHandlerOptions
    {
        return this._options;
    }
    public set options(options: BasicKeyboardHandlerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: BasicKeyboardHandlerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of BasicKeyboardHandler #########################

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