import {ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgSelectPluginGeneric, OptionsGatherer, CompareValueFunc} from '../../misc';
import {NgSelectPluginInstances} from '../../components/select';
import {KeyboardHandler, KEYBOARD_HANDLER} from '../keyboardHandler';
import {Popup, POPUP} from '../popup';
import {ɵNgSelectOption, NgSelectOption} from '../../components/option';
import {NormalState, NORMAL_STATE} from '../normalState';
import {ValueHandler, ValueHandlerOptions} from './valueHandler.interface';

/**
 * Base class for value handlers
 */
export abstract class ValueHandlerBase<TValue, TOptions extends ValueHandlerOptions> implements ValueHandler<TValue>, NgSelectPluginGeneric<TOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: TOptions;

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
     * Subscription for canceling an option
     */
    protected _cancelOptionSubscription: Subscription;

    //######################### public properties - implementation of DynamicValueHandler #########################

    /**
     * Options for NgSelect plugin
     */
    public abstract options: TOptions;

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
    constructor(public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef)
    {
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

        if(this._cancelOptionSubscription)
        {
            this._cancelOptionSubscription.unsubscribe();
            this._cancelOptionSubscription = null;
        }
    }

    //######################### public methods - implementation of DynamicValueHandler #########################

    /**
     * Sets value for NgSelect
     * @param value Value to be set
     */
    public abstract setValue(value:TValue|TValue[]): void;

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

            this._optionsChangeSubscription = this.optionsGatherer.optionsChange.subscribe(() => this._loadOptions());
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

        if(this._normalState && this._normalState != normalState)
        {
            this._cancelOptionSubscription.unsubscribe();
            this._cancelOptionSubscription = null;

            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;

            this._cancelOptionSubscription = this._normalState.cancelOption.subscribe(this._cancelValue);
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
    protected abstract _setValue: (option: ɵNgSelectOption<TValue>) => void;

    /**
     * Cancels, removes option from selected options
     * @param option Option to be canceled
     */
    protected _cancelValue = (option: ɵNgSelectOption<TValue>): void =>
    {
        if(Array.isArray(this.selectedOptions))
        {
            let index = this.selectedOptions.indexOf(option);

            if(index >= 0)
            {
                this.selectedOptions.splice(index, 1);
            }
        }
        else
        {
            if(this.selectedOptions == option)
            {
                this.selectedOptions = null;
            }
        }

        this._clearSelected();
        this._markValueAsSelected();

        this._normalState.invalidateVisuals();
        this.valueChange.emit();
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
    protected abstract _loadOptions(): void;
}