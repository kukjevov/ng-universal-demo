import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicValueHandlerOptions, BasicValueHandler} from './basicValueHandler.interface';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {VALUE_HANDLER_OPTIONS} from '../valueHandler.interface';
import {ɵNgSelectOption, } from '../../../components/option';
import {ValueHandlerBase} from '../valueHandlerBase';

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
export class BasicValueHandlerComponent<TValue> extends ValueHandlerBase<TValue, BasicValueHandlerOptions> implements BasicValueHandler<TValue>
{
    //######################### protected fields #########################

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

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() ngSelectPlugins: NgSelectPluginInstances,
                pluginElement: ElementRef,
                @Inject(VALUE_HANDLER_OPTIONS) @Optional() options?: BasicValueHandlerOptions)
    {
        super(ngSelectPlugins, pluginElement);

        this._options = extend(true, {}, defaultOptions, options);
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

            if(Array.isArray(this.selectedOptions))
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

                this.selectedOptions = this.optionsGatherer.options.filter(itm => !!items.find(it => this.valueComparer(it, itm.value)));
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