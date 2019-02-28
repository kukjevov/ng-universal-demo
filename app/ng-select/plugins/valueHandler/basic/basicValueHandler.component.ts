import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicValueHandlerOptions, BasicValueHandler} from './basicValueHandler.interface';
import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {VALUE_HANDLER_OPTIONS} from '../valueHandler.interface';
import {KeyboardHandler, KEYBOARD_HANDLER} from '../../keyboardHandler';
import {Popup, POPUP} from '../../popup';
import {ɵNgSelectOption} from '../../../components/option';

/**
 * Default options for value handler
 * @internal
 */
const defaultOptions: BasicValueHandlerOptions =
{
    multiple: false
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
export class BasicValueHandlerComponent<TValue> implements BasicValueHandler<TValue>, NgSelectPluginGeneric<BasicValueHandlerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicValueHandlerOptions;

    /**
     * Keyboard handler that is used
     */
    protected _keyboardHandler: KeyboardHandler;

    /**
     * Popup that is used
     */
    protected _popup: Popup;

    /**
     * Subscription for option selection using keyboard
     */
    protected _optionSelectSubscription: Subscription;

    /**
     * Subscription for option selection using mouse
     */
    protected _optionClickSubscription: Subscription;

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

    /**
     * Occurs when value of NgSelect changes
     */
    public valueChange: EventEmitter<TValue|TValue[]> = new EventEmitter<TValue|TValue[]>();

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Occurs when there is requested for change of visibility of popup using keyboard
     */
    public popupVisibilityRequest: EventEmitter<boolean> = new EventEmitter<boolean>();

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: BasicValueHandlerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionSelectSubscription)
        {
            this._optionSelectSubscription.unsubscribe();
            this._optionSelectSubscription = null;
        }

        if(this._optionClickSubscription)
        {
            this._optionClickSubscription.unsubscribe();
            this._optionClickSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicValueHandler #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        let keyboardHandler = this.ngSelectPlugins[KEYBOARD_HANDLER] as KeyboardHandler;

        if(this._keyboardHandler && this._keyboardHandler != keyboardHandler)
        {
            this._optionSelectSubscription.unsubscribe();
            this._optionSelectSubscription = null;

            this._keyboardHandler = null;
        }

        if(!this._keyboardHandler)
        {
            this._keyboardHandler = keyboardHandler;

            this._optionSelectSubscription = this._keyboardHandler.optionSelect.subscribe((option: ɵNgSelectOption<TValue>) => console.log(option));
        }

        let popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._optionClickSubscription.unsubscribe();
            this._optionClickSubscription = null;

            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;

            this._optionClickSubscription = this._popup.optionClick.subscribe((option: ɵNgSelectOption<TValue>) => console.log(option));
        }
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