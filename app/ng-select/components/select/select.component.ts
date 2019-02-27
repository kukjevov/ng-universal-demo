import {Component, ChangeDetectionStrategy, FactoryProvider, Input, Inject, ChangeDetectorRef, Optional, Type, AfterViewInit, OnInit, ContentChildren, QueryList, EventEmitter, forwardRef, resolveForwardRef} from "@angular/core";
import {extend} from "@asseco/common";

import {NgSelectOptions, NG_SELECT_OPTIONS, KEYBOARD_HANDLER_TYPE, NORMAL_STATE_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, VALUE_HANDLER_TYPE, LIVE_SEARCH_TYPE, NgSelectPlugin, OptionsGatherer, PluginDescription} from "../../misc";
import {NG_SELECT_PLUGIN_INSTANCES, NgSelect, NgSelectPluginInstances, NgSelectAction, NgSelectFunction} from "./select.interface";
import {KeyboardHandler, KEYBOARD_HANDLER} from "../../plugins/keyboardHandler";
import {NormalState, NORMAL_STATE, BasicNormalStateComponent} from "../../plugins/normalState";
import {Popup, POPUP} from "../../plugins/popup";
import {Positioner, POSITIONER} from "../../plugins/positioner";
import {ReadonlyState} from "../../plugins/readonlyState";
import {ValueHandler} from "../../plugins/valueHandler";
import {LiveSearch} from "../../plugins/liveSearch";
import {TextsLocator, TEXTS_LOCATOR, NoTextsLocatorComponent} from "../../plugins/textsLocator";
import {OptionComponent, NgSelectOption, OptGroupComponent, NgSelectOptGroup} from "../option";

/**
 * Default 'NgSelectOptions'
 * @internal
 */
const defaultOptions: NgSelectOptions<any> =
{
    autoInitialize: true,
    cssClasses: 
    {
    },
    plugins:
    {
        normalState: <PluginDescription<BasicNormalStateComponent<any>>>
        {
            type: forwardRef(() => BasicNormalStateComponent)
        },
        textsLocator: <PluginDescription<NoTextsLocatorComponent>>
        {
            type: forwardRef(() => NoTextsLocatorComponent)
        }
    }
};

/**
 * NgSelect plugin instances factory method
 * @internal
 */
export function ngSelectPluginInstancesFactory()
{
    return {};
}

/**
 * Component that represents NgSelect itself, allows selection of value from options
 */
@Component(
{
    selector: 'ng-select',
    templateUrl: 'select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <FactoryProvider>
        {
            provide: NG_SELECT_PLUGIN_INSTANCES,
            useFactory: ngSelectPluginInstancesFactory
        }
    ]
})
export class NgSelectComponent<TValue> implements NgSelect<TValue>, OnInit, AfterViewInit, OptionsGatherer<TValue>
{
    //######################### private fields #########################

    /**
     * NgSelect options
     */
    private _selectOptions: NgSelectOptions<TValue>;

    /**
     * Occurs when array of provided options has changed
     */
    private _optionsChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - inputs #########################

    /**
     * Gets or sets NgSelect options
     */
    @Input()
    public set selectOptions(options: NgSelectOptions<TValue>)
    {
        this._selectOptions = extend(true, this._selectOptions, options);
    }
    public get selectOptions(): NgSelectOptions<TValue>
    {
        return this._selectOptions;
    }

    //######################### public properties - implementation of OptionsGatherer #########################
    
    /**
     * Array of provided options for select
     * @internal
     */
    public get options(): NgSelectOption<TValue>[]
    {
        return this.optionsChildren.toArray();
    }

    /**
     * Occurs when array of provided options has changed
     * @internal
     */
    public get optionsChange(): EventEmitter<void>
    {
        return this._optionsChange;
    }

    //######################### public properties - children #########################

    /**
     * Options children found inside ng-select
     * @internal
     */
    @ContentChildren(OptGroupComponent)
    public optionsChildren: QueryList<NgSelectOption<any>>;

    //######################### public properties - children #########################

    /**
     * Options groups children found inside ng-select
     * @internal
     */
    @ContentChildren(OptionComponent)
    public optGroupsChildren: QueryList<NgSelectOptGroup<any>>;

    //######################### constructors #########################
    constructor(private _changeDetector: ChangeDetectorRef,
                @Inject(NG_SELECT_PLUGIN_INSTANCES) private _pluginInstances: NgSelectPluginInstances,
                @Inject(NG_SELECT_OPTIONS) @Optional() options?: NgSelectOptions<TValue>,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState<TValue>>,
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<Popup>,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler>,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>,
                @Inject(TEXTS_LOCATOR) @Optional() textsLocatorType?: Type<TextsLocator>)
    {
        let opts: NgSelectOptions<TValue> = extend(true, {}, options);

        if(!opts.plugins)
        {
            opts.plugins = {};
        }

        if(keyboardHandlerType)
        {
            if(!opts.plugins.keyboardHandler)
            {
                opts.plugins.keyboardHandler = {};
            }

            opts.plugins.keyboardHandler.type = keyboardHandlerType;
        }

        if(normalStateType)
        {
            if(!opts.plugins.normalState)
            {
                opts.plugins.normalState = {};
            }

            opts.plugins.normalState.type = normalStateType;
        }

        if(popupType)
        {
            if(!opts.plugins.popup)
            {
                opts.plugins.popup = {};
            }

            opts.plugins.popup.type = popupType;
        }

        if(positionerType)
        {
            if(!opts.plugins.positioner)
            {
                opts.plugins.positioner = {};
            }

            opts.plugins.positioner.type = positionerType;
        }

        if(readonlyStateType)
        {
            if(!opts.plugins.readonlyState)
            {
                opts.plugins.readonlyState = {};
            }

            opts.plugins.readonlyState.type = readonlyStateType;
        }

        if(valueHandlerType)
        {
            if(!opts.plugins.valueHandler)
            {
                opts.plugins.valueHandler = {};
            }

            opts.plugins.valueHandler.type = valueHandlerType;
        }

        if(liveSearchType)
        {
            if(!opts.plugins.liveSearch)
            {
                opts.plugins.liveSearch = {};
            }

            opts.plugins.liveSearch.type = liveSearchType;
        }

        if(textsLocatorType)
        {
            if(!opts.plugins.textsLocator)
            {
                opts.plugins.textsLocator = {};
            }

            opts.plugins.textsLocator.type = textsLocatorType;
        }

        this._selectOptions = extend(true, {optionsGatherer: this}, defaultOptions, opts);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.initOptions();
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        if(this._selectOptions.autoInitialize)
        {
            this.initialize();
        }
    }

    //######################### public methods - template bindings #########################

    /**
     * Sets normal state component
     * @param {NormalState} normalState Created normal state that is rendered
     * @internal
     */
    public setNormalStateComponent(normalState: NormalState<TValue>)
    {
        if(!normalState)
        {
            return;
        }

        this._pluginInstances[NORMAL_STATE] = normalState;

        if(this._selectOptions.plugins && this._selectOptions.plugins.normalState && this._selectOptions.plugins.normalState.options)
        {
            normalState.options = this._selectOptions.plugins.normalState.options;
        }

        normalState.initOptions();
        
        if(this._selectOptions.plugins && this._selectOptions.plugins.normalState && this._selectOptions.plugins.normalState.instanceCallback)
        {
            this._selectOptions.plugins.normalState.instanceCallback(normalState);
        }
    }

    /**
     * Sets keyboard handler component
     * @param {KeyboardHandler} keyboardHandler Created keyboard handler that is rendered
     * @internal
     */
    public setKeyboardHandlerComponent(keyboardHandler: KeyboardHandler)
    {
        if(!keyboardHandler)
        {
            return;
        }

        this._pluginInstances[KEYBOARD_HANDLER] = keyboardHandler;

        if(this._selectOptions.plugins && this._selectOptions.plugins.keyboardHandler && this._selectOptions.plugins.keyboardHandler.options)
        {
            keyboardHandler.options = this._selectOptions.plugins.keyboardHandler.options;
        }

        keyboardHandler.initOptions();
        
        if(this._selectOptions.plugins && this._selectOptions.plugins.keyboardHandler && this._selectOptions.plugins.keyboardHandler.instanceCallback)
        {
            this._selectOptions.plugins.keyboardHandler.instanceCallback(keyboardHandler);
        }
    }

    /**
     * Sets popup component
     * @param {Popup} popup Created popup that is rendered
     * @internal
     */
    public setPopupComponent(popup: Popup)
    {
        if(!popup)
        {
            return;
        }

        this._pluginInstances[POPUP] = popup;

        if(this._selectOptions.plugins && this._selectOptions.plugins.popup && this._selectOptions.plugins.popup.options)
        {
            popup.options = this._selectOptions.plugins.popup.options;
        }

        popup.initOptions();
        
        if(this._selectOptions.plugins && this._selectOptions.plugins.popup && this._selectOptions.plugins.popup.instanceCallback)
        {
            this._selectOptions.plugins.popup.instanceCallback(popup);
        }
    }

    /**
     * Sets positioner component
     * @param {Positioner} positioner Created positioner that is rendered
     * @internal
     */
    public setPositionerComponent(positioner: Positioner)
    {
        if(!positioner)
        {
            return;
        }

        this._pluginInstances[POSITIONER] = positioner;

        if(this._selectOptions.plugins && this._selectOptions.plugins.positioner && this._selectOptions.plugins.positioner.options)
        {
            positioner.options = this._selectOptions.plugins.positioner.options;
        }

        positioner.initOptions();
        
        if(this._selectOptions.plugins && this._selectOptions.plugins.positioner && this._selectOptions.plugins.positioner.instanceCallback)
        {
            this._selectOptions.plugins.positioner.instanceCallback(positioner);
        }
    }

    /**
     * Sets texts locator component
     * @param {TextsLocator} textsLocator Created texts locator that is rendered
     * @internal
     */
    public setTextsLocatorComponent(textsLocator: TextsLocator)
    {
        if(!textsLocator)
        {
            return;
        }

        this._pluginInstances[TEXTS_LOCATOR] = textsLocator;

        if(this._selectOptions.plugins && this._selectOptions.plugins.textsLocator && this._selectOptions.plugins.textsLocator.options)
        {
            textsLocator.options = this._selectOptions.plugins.textsLocator.options;
        }

        textsLocator.initOptions();
        
        if(this._selectOptions.plugins && this._selectOptions.plugins.textsLocator && this._selectOptions.plugins.textsLocator.instanceCallback)
        {
            this._selectOptions.plugins.textsLocator.instanceCallback(textsLocator);
        }
    }

    //######################### public methods #########################

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    public initialize()
    {
        this._pluginInstances[TEXTS_LOCATOR].initialize();
        this._pluginInstances[NORMAL_STATE].initialize();
        // this._pluginInstances[METADATA_SELECTOR].initialize();
        // this._pluginInstances[PAGING_INITIALIZER].initialize();
        // this._pluginInstances[PAGING].initialize();
        // this._pluginInstances[CONTENT_RENDERER].initialize();
        // this._pluginInstances[NO_DATA_RENDERER].initialize();
        // this._pluginInstances[DATA_LOADER].initialize();
    }

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    public initOptions()
    {
        if(this._selectOptions.plugins)
        {
            if(this._selectOptions.plugins.normalState)
            {
                this._selectOptions.plugins.normalState.type = resolveForwardRef(this._selectOptions.plugins.normalState.type);

                if(this._pluginInstances[NORMAL_STATE])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.normalState && this._selectOptions.plugins.normalState.options)
                    {
                        this._pluginInstances[NORMAL_STATE].options = this._selectOptions.plugins.normalState.options;
                    }

                    this._pluginInstances[NORMAL_STATE].initOptions();
                }
            }

            if(this._selectOptions.plugins.textsLocator)
            {
                this._selectOptions.plugins.textsLocator.type = resolveForwardRef(this._selectOptions.plugins.textsLocator.type);

                if(this._pluginInstances[TEXTS_LOCATOR])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.textsLocator && this._selectOptions.plugins.textsLocator.options)
                    {
                        this._pluginInstances[TEXTS_LOCATOR].options = this._selectOptions.plugins.textsLocator.options;
                    }

                    this._pluginInstances[TEXTS_LOCATOR].initOptions();
                }
            }
        }
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    /**
     * Gets instance of plugin by its id
     * @param {string} pluginId Id of plugin, use constants
     */
    public getPlugin<PluginType extends NgSelectPlugin>(pluginId: string): PluginType
    {
        return this._pluginInstances[pluginId] as PluginType;
    }

    /**
     * Executes actions on NgSelect
     * @param actions Array of actions that are executed over NgSelect
     */
    public execute(...actions: NgSelectAction<TValue>[])
    {
        if(!actions)
        {
            return;
        }

        actions.forEach(action => action(this));
    }

    /**
     * Executes function on NgSelect and returns result
     * @param func Function that is executed and its result is returned
     */
    public executeAndReturn<TResult>(func: NgSelectFunction<TResult, TValue>): TResult
    {
        if(!func)
        {
            return null;
        }

        return func(this);
    }
}