import {Component, ChangeDetectionStrategy, FactoryProvider, Input, Inject, ChangeDetectorRef, Optional, Type, AfterViewInit, OnInit, ContentChildren, QueryList, EventEmitter} from "@angular/core";
import {extend} from "@asseco/common";

import {NgSelectOptions, NG_SELECT_OPTIONS, KEYBOARD_HANDLER_TYPE, NORMAL_STATE_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, VALUE_HANDLER_TYPE, LIVE_SEARCH_TYPE, NgSelectPlugin, OptionsGatherer} from "../../misc";
import {NG_SELECT_PLUGIN_INSTANCES, NgSelect, NgSelectPluginInstances} from "./select.interface";
import {KeyboardHandler} from "../../plugins/keyboardHandler";
import {NormalState} from "../../plugins/normalState";
import {Popup} from "../../plugins/popup";
import {Positioner} from "../../plugins/positioner";
import {ReadonlyState} from "../../plugins/readonlyState";
import {ValueHandler} from "../../plugins/valueHandler";
import {LiveSearch} from "../../plugins/liveSearch";
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
        // pagingInitializer: <PluginDescription<NoPagingInitializerComponent>>
        // {
        //     type: forwardRef(() => NoPagingInitializerComponent)
        // }
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
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler>,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState>,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler>,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>)
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


        this._selectOptions = extend(true, {optionsGatherer: this}, defaultOptions, opts);
        console.log(this._selectOptions);
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

    //######################### public methods #########################

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    public initialize()
    {
        // this._pluginInstances[TEXTS_LOCATOR].initialize();
        // this._pluginInstances[ROW_SELECTOR].initialize();
        // this._pluginInstances[METADATA_SELECTOR].initialize();
        // this._pluginInstances[PAGING_INITIALIZER].initialize();
        // this._pluginInstances[PAGING].initialize();
        // this._pluginInstances[CONTENT_RENDERER].initialize();
        // this._pluginInstances[NO_DATA_RENDERER].initialize();
        // this._pluginInstances[DATA_LOADER].initialize();

        // this._initializedSubject.next(true);
    }

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    public initOptions()
    {
        // if(this._gridOptions.plugins)
        // {
        //     if(this._gridOptions.plugins.paging)
        //     {
        //         this._gridOptions.plugins.paging.type = resolveForwardRef(this._gridOptions.plugins.paging.type);

        //         if(this._gridOptions.plugins.paging.instance &&
        //            this._gridOptions.plugins.paging.instance != this._pluginInstances[PAGING])
        //         {
        //             this._pluginInstances[PAGING] = this._gridOptions.plugins.paging.instance;
        //             this._gridOptions.plugins.paging.instance.gridPlugins = this._pluginInstances;
        //         }

        //         if(this._pluginInstances[PAGING])
        //         {
        //             if(this._gridOptions.plugins && this._gridOptions.plugins.paging && this._gridOptions.plugins.paging.options)
        //             {
        //                 this._pluginInstances[PAGING].options = this._gridOptions.plugins.paging.options;
        //             }

        //             this._pluginInstances[PAGING].initOptions();
        //         }
        //     }
        // }
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
}