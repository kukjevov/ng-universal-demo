import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {forwardRef, ExistingProvider, Directive, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {NgSelectComponent} from '../components/select';
import {valueChange, setValue} from '../extensions';

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
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;

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
        this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                this._select.execute(setValue(value));
            }
        });
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: TValue|Array<TValue>) => void): void
    {
        this._select.initialized.subscribe(initialized =>
        {
            if(initialized)
            {
                if(this._changeSubscription)
                {
                    this._changeSubscription.unsubscribe();
                    this._changeSubscription = null;
                }

                this._changeSubscription = this._select.executeAndReturn(valueChange(value =>
                {
                    // this._lastValue = this._select.value;
                    fn(value);
                }));
            }
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
    }
}