import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicNormalStateOptions, BasicNormalState} from './basicNormalState.interface';
import {NgSelectPluginGeneric, TemplateGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {NORMAL_STATE_OPTIONS, NormalStateTexts} from '../normalState.interface';
import {TextsLocator, TEXTS_LOCATOR} from '../../textsLocator';
import {ValueHandler, VALUE_HANDLER} from '../../valueHandler';

/**
 * Default options for normal state
 * @internal
 */
const defaultOptions: BasicNormalStateOptions =
{
    cssClasses:
    {
        normalStateElement: 'btn btn-select',
        selectedCarret: 'selected-caret fa fa-caret-down',
        selectedValue: 'selected-value'
    },
    texts:
    {
        nothingSelected: 'Nothing selected'
    },
    readonly: false
};

/**
 * Component used for rendering basic simple normal state of select
 */
@Component(
{
    selector: "div.normal-state",
    templateUrl: 'basicNormalState.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
        `button.btn-select
         {
             display: flex;
             width: 100%;
             padding: 4px 0px 4px 4px;
             background-color: #ffffff;
             background-image: none;
             border: 1px solid #cccccc;
             border-radius: 4px;
             box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;
         }
       
         button.btn-select .selected-value
         {
             flex: 1;
             text-align: left;
         }
       
         button.btn-select .selected-caret
         {
             flex: 0 0 20px;
             align-self: center;
         }`
    ]
})
export class BasicNormalStateComponent implements BasicNormalState, NgSelectPluginGeneric<BasicNormalStateOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Texts locator used for handling texts
     */
    protected _textsLocator: TextsLocator;

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicNormalStateOptions;

    //######################### public properties - implementation of BasicNormalState #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicNormalStateOptions
    {
        return this._options;
    }
    public set options(options: BasicNormalStateOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * Occurs when user clicks on normal state
     */
    public click: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Occurs when normal state gains focus
     */
    public focus: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Gatherer used for obtaining custom templates
     */
    public templateGatherer: TemplateGatherer;

    //######################### public properties - template bindings #########################

    /**
     * Object containing available texts
     * @internal
     */
    public texts: NormalStateTexts = {};

    /**
     * Value handler used in NgSelect
     * @internal
     */
    public valueHandler: ValueHandler<any>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(NORMAL_STATE_OPTIONS) @Optional() options?: BasicNormalStateOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._textsChangedSubscription)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicNormalState #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        let textsLocator = this.ngSelectPlugins[TEXTS_LOCATOR] as TextsLocator;

        if(this._textsLocator && this._textsLocator != textsLocator)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;

            this._textsLocator = null;
        }

        if(!this._textsLocator)
        {
            this._textsLocator = textsLocator;

            this._textsChangedSubscription = this._textsLocator.textsChange.subscribe(() => this._initTexts());
        }

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler<any>;

        if(this.valueHandler && this.valueHandler != valueHandler)
        {
            this.valueHandler = null;
        }

        if(!this.valueHandler)
        {
            this.valueHandler = valueHandler;
        }

        this._initTexts();
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

    //######################### protected methods #########################

    /**
     * Initialize texts
     */
    protected _initTexts()
    {
        Object.keys(this.options.texts).forEach(key =>
        {
            this.texts[key] = this._textsLocator.getText(this.options.texts[key]);
        });

        this._changeDetector.detectChanges();
    }
}