import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgSelectComponent} from '../components/ngSelect.component';

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
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;

    /**
     * Subscription for last value request
     */
    private _lastValueRequestSubscription: Subscription = null;

    /**
     * Last set value to this control
     */
    private _lastValue: TValue|Array<TValue>;

    //######################### constructor #########################
    constructor(private _select: NgSelectComponent<TValue>)
    {
        this._lastValueRequestSubscription = this._select
            .optionsAndValueManager
            .lastValueRequest
            .subscribe(() =>
        {
            this._select.optionsAndValueManager.setValue(this._lastValue, {noModelChange: true});
        });
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: TValue|Array<TValue>): void
    {
        this._lastValue = value;

        if(this._select.optionsAndValueManager.initialized)
        {
            this._select.optionsAndValueManager.setValue(value, {noModelChange: true});
        }
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: TValue|Array<TValue>) => void): void
    {
        this._changeSubscription = this._select.optionsAndValueManager.valueChange.subscribe(() =>
        {
            this._lastValue = this._select.value;
            fn(this._select.value);
        });
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(): void
    {
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

        if(this._lastValueRequestSubscription)
        {
            this._lastValueRequestSubscription.unsubscribe();
            this._lastValueRequestSubscription = null;
        }
    }
}