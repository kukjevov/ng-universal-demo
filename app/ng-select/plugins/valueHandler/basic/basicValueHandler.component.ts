import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicValueHandlerOptions, BasicValueHandler} from './basicValueHandler.interface';
import {NgSelectPluginGeneric, OptionsGatherer, CompareValueFunc} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {VALUE_HANDLER_OPTIONS} from '../valueHandler.interface';
import {KeyboardHandler, KEYBOARD_HANDLER} from '../../keyboardHandler';
import {Popup, POPUP} from '../../popup';
import {ɵNgSelectOption, NgSelectOption} from '../../../components/option';
import {NormalState, NORMAL_STATE} from '../../normalState';

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
     * Normal state that is used
     */
    protected _normalState: NormalState;

    /**
     * Subscription for option selection using keyboard
     */
    protected _optionSelectSubscription: Subscription;

    /**
     * Subscription for option selection using mouse
     */
    protected _optionClickSubscription: Subscription;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Backed up unmapped value that was set before options were obtained
     */
    protected _unmappedValue: TValue|TValue[];

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
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<TValue>;

    /**
     * Function of value comparer that is used for comparison of values
     */
    public valueComparer: CompareValueFunc<TValue>;

    /**
     * Occurs when there is requested for change of visibility of popup using keyboard
     */
    public popupVisibilityRequest: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Current value of NgSelect
     */
    public selectedOptions: NgSelectOption<TValue>|NgSelectOption<TValue>[];

    /**
     * Current selected value of NgSelect
     */
    public get value(): TValue|TValue[]
    {
        if(this.selectedOptions)
        {
            if(Array.isArray(this.selectedOptions))
            {
                return this.selectedOptions.map(opt => opt.value);
            }
            else
            {
                return this.selectedOptions.value;
            }
        }

        return null;
    }

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
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

        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicValueHandler #########################

    /**
     * Sets value for NgSelect
     * @param value Value to be set
     */
    public setValue(value:TValue|TValue[]): void
    {
        this._useOptionsAsValue(value);
    }

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this.optionsGatherer && this.optionsGatherer != this.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this.optionsGatherer = null;
        }

        if(!this.optionsGatherer)
        {
            this.optionsGatherer = this.optionsGatherer;

            this._optionsChangeSubscription = this.optionsGatherer.availableOptionsChange.subscribe(() => this._loadOptions());
        }

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

            this._optionSelectSubscription = this._keyboardHandler.optionSelect.subscribe(this._setValue);
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

            this._optionClickSubscription = this._popup.optionClick.subscribe(this._setValue);
        }

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(!this._normalState || this._normalState != normalState)
        {
            this._normalState = normalState;
        }

        this._loadOptions();
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

    //######################### protected methods #########################

    /**
     * Sets value 
     */
    protected _setValue = (option: ɵNgSelectOption<TValue>) =>
    {
        //multiple values are allowed
        if(this.options.multiple)
        {
            if(!Array.isArray(this.selectedOptions))
            {
                this.selectedOptions = [];
            }
            else
            {
                let index: number;

                //value exists, removing from list
                if((index = this.selectedOptions.indexOf(option)) >= 0)
                {
                    this.selectedOptions.splice(index, 1);
                }
                //adding value
                else
                {
                    this.selectedOptions.push(option);
                }
            }
        }
        else
        //only signle value allowed
        {
            this.selectedOptions = option;
        }

        this._clearSelected();
        this._markValueAsSelected();

        this._normalState.invalidateVisuals();
        this.valueChange.emit();

        //close popup if not multiple
        if(!this.options.multiple)
        {
            this.popupVisibilityRequest.emit(false);
        }
        else
        {
            this._popup.invalidateVisuals();
        }
    }

    /**
     * Clears all selected values
     */
    protected _clearSelected()
    {
        this.optionsGatherer.options.forEach((option: ɵNgSelectOption<TValue>) => option.selected = false);
    }

    /**
     * Marks current value as selected
     */
    protected _markValueAsSelected()
    {
        if(this.selectedOptions)
        {
            if(Array.isArray(this.selectedOptions))
            {
                this.selectedOptions.forEach((option: ɵNgSelectOption<TValue>) => option.selected = true);
            }
            else
            {
                (this.selectedOptions as ɵNgSelectOption<TValue>).selected = true;
            }
        }
    }

    /**
     * Loads options
     */
    protected _loadOptions()
    {
        this._useOptionsAsValue(this._unmappedValue || this.value);
    }

    /**
     * Converts value to options
     * @param value Value to be changed to options
     */
    protected _useOptionsAsValue(value: TValue|TValue[])
    {
        //set empty value
        if(!value || (Array.isArray(value) && !value.length))
        {
            this.selectedOptions = value;

            return;
        }

        //no options available yet
        if(!this.optionsGatherer.options || !this.optionsGatherer.options.length)
        {
            this._unmappedValue = value;

            return;
        }

        if(this.options.multiple)
        {
            if(Array.isArray(value))
            {
                let items = value;

                this.selectedOptions = this.optionsGatherer.availableOptions.filter(itm => !!items.find(it => this.valueComparer(it, itm.value)));
            }
            else
            {
                throw new Error('Don`t you have redundant "multiple"?');
            }
        }
        else
        {
            if(Array.isArray(value))
            {
                throw new Error('Are you missing attribute "multiple"?');
            }
            else
            {
                let item = value;

                this.selectedOptions = this.optionsGatherer.options.find(itm => this.valueComparer(itm.value, item));
            }
        }

        this._clearSelected();
        this._markValueAsSelected();
        this._unmappedValue = null;
        this._normalState.invalidateVisuals();
    }
}