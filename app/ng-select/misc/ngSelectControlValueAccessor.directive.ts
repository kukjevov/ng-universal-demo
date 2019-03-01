import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgSelectComponent} from '../components/select';
import {valueChange, setValue, onFocus, setReadonly} from '../extensions';

/**
 * Provider for control value accessor
 * @internal
 */
const NG_SELECT_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectControlValueAccessor),
    multi: true
};

/**
 * Control value accessor for NgSelectComponent
 */
@Directive(
{
    selector: 'ng-select[formControlName],ng-select[formControl],ng-select[ngModel]',
    providers: [NG_SELECT_VALUE_ACCESSOR]
})
export class NgSelectControlValueAccessor<TValue> implements ControlValueAccessor, OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for initialized status of NgSelect, used for writeValue
     */
    private _initializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for registerOnChange
     */
    private _changeInitializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for registerOnTouched
     */
    private _touchInitializedSubscription: Subscription;

    /**
     * Subscription for initialized status of NgSelect, used for setDisabledState
     */
    private _disabledInitializedSubscription: Subscription;

    /**
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;

    /**
     * Subscription that looks for changes of select
     */
    private _focusSubscription: Subscription = null;

    //######################### constructor #########################
    constructor(private _select: NgSelectComponent<TValue>)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: TValue|Array<TValue>): void
    {
        if(this._select.isInitialized)
        {
            this._select.execute(setValue(value));

            return;
        }

        if(this._initializedSubscription)
        {
            this._initializedSubscription.unsubscribe();
            this._initializedSubscription = null;
        }

        this._initializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                this._initializedSubscription.unsubscribe();
                this._initializedSubscription = null;
                
                this._select.execute(setValue(value));
            }
        });
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: TValue|Array<TValue>) => void): void
    {
        this._changeInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                if(this._changeSubscription)
                {
                    this._changeSubscription.unsubscribe();
                    this._changeSubscription = null;
                }

                this._changeSubscription = this._select.executeAndReturn(valueChange(fn));
            }
        });
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(fn: () => void): void
    {
        this._touchInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                if(this._focusSubscription)
                {
                    this._focusSubscription.unsubscribe();
                    this._focusSubscription = null;
                }

                this._focusSubscription = this._select.executeAndReturn(onFocus(fn));
            }
        });
    }

    /**
     * Sets NgSelect as disabled/readonly
     * @param isDisabled Indication whether is control disabled or not
     */
    public setDisabledState(isDisabled: boolean): void 
    {
        if(this._select.isInitialized)
        {
            this._select.execute(setReadonly(isDisabled));

            return;
        }

        if(this._disabledInitializedSubscription)
        {
            this._disabledInitializedSubscription.unsubscribe();
            this._disabledInitializedSubscription = null;
        }

        this._disabledInitializedSubscription = this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                this._disabledInitializedSubscription.unsubscribe();
                this._disabledInitializedSubscription = null;

                this._select.execute(setReadonly(isDisabled));
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._changeSubscription)
        {
            this._changeSubscription.unsubscribe();
            this._changeSubscription = null;
        }

        if(this._initializedSubscription)
        {
            this._initializedSubscription.unsubscribe();
            this._initializedSubscription = null;
        }

        if(this._changeInitializedSubscription)
        {
            this._changeInitializedSubscription.unsubscribe();
            this._changeInitializedSubscription = null;
        }

        if(this._touchInitializedSubscription)
        {
            this._touchInitializedSubscription.unsubscribe();
            this._touchInitializedSubscription = null;
        }

        if(this._focusSubscription)
        {
            this._focusSubscription.unsubscribe();
            this._focusSubscription = null;
        }

        if(this._disabledInitializedSubscription)
        {
            this._disabledInitializedSubscription.unsubscribe();
            this._disabledInitializedSubscription = null;
        }
    }
}