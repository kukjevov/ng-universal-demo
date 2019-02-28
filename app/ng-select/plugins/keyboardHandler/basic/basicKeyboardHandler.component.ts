import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';

import {BasicKeyboardHandlerOptions, BasicKeyboardHandler} from './basicKeyboardHandler.interface';
import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {KEYBOARD_HANDLER_OPTIONS} from '../keyboardHandler.interface';
import {ɵNgSelectOption} from '../../../components/option';

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
export class BasicKeyboardHandlerComponent implements BasicKeyboardHandler, NgSelectPluginGeneric<BasicKeyboardHandlerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicKeyboardHandlerOptions;

    //######################### protected properties #########################

    /**
     * Gets currently available options
     */
    protected get availableOptions(): ɵNgSelectOption<any>[]
    {
        return this.optionsGatherer.options;
    }

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

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                @Inject(KEYBOARD_HANDLER_OPTIONS) @Optional() options?: BasicKeyboardHandlerOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this.selectElement)
        {
            this.selectElement.removeEventListener('keydown', this._handleKeyboard);
        }
    }

    //######################### public methods - implementation of BasicKeyboardHandler #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this.selectElement)
        {
            this.selectElement.addEventListener('keydown', this._handleKeyboard);
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

    //######################### protected methods #########################

    /**
     * Handles keyboard event
     * @param event Keyboard event that occured
     */
    protected _handleKeyboard = (event: KeyboardEvent) =>
    {
        console.log('ok');

        if(event.key == "ArrowDown" || event.key == "ArrowUp")
        {
            //TODO - open 
            // this.optionsDivVisible = true;
            let activeOption = this.availableOptions.find(itm => itm.active);

            if(activeOption)
            {
                let index = this.availableOptions.indexOf(activeOption);
                activeOption.active = false;

                //move down cursor
                if(event.key == "ArrowDown")
                {
                    index += 1;
                }
                //move up cursor
                else
                {
                    index -= 1;
                }

                if(index < 0)
                {
                    index = this.availableOptions.length - 1;
                }

                index = index % this.availableOptions.length;

                this.availableOptions[index].active = true;
            }
            //none active before
            else if(this.availableOptions.length)
            {
                this.availableOptions[0].active = true;
            }

            event.preventDefault();
        }

        if(event.key == "Enter")
        {
            let activeOption = this.availableOptions.find(itm => itm.active);

            if(activeOption)
            {
                // this._optionsAndValueManager.setSelected(activeOption);
            }
        }

        if(event.key == "Tab")
        {
            //TODO - close 
            // this.optionsDivVisible = false;
        }
    }
}