import {Component, ChangeDetectionStrategy, FactoryProvider, Input, Inject, ChangeDetectorRef, Optional, Type, AfterViewInit, OnInit, ContentChildren, QueryList, EventEmitter, forwardRef, resolveForwardRef, ElementRef, OnChanges, SimpleChanges, Attribute, OnDestroy, TemplateRef, ContentChild} from "@angular/core";
import {extend, nameof, isBoolean, isPresent} from "@asseco/common";
import {BehaviorSubject, Observable, Subscription} from "rxjs";

import {NgSelectOptions, NG_SELECT_OPTIONS, KEYBOARD_HANDLER_TYPE, NORMAL_STATE_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, VALUE_HANDLER_TYPE, LIVE_SEARCH_TYPE, NgSelectPlugin, OptionsGatherer, PluginDescription, TemplateGatherer} from "../../misc";
import {NG_SELECT_PLUGIN_INSTANCES, NgSelect, NgSelectPluginInstances, NgSelectAction, NgSelectFunction} from "./select.interface";
import {KeyboardHandler, KEYBOARD_HANDLER, BasicKeyboardHandlerComponent} from "../../plugins/keyboardHandler";
import {NormalState, NORMAL_STATE, BasicNormalStateComponent, NormalStateContext} from "../../plugins/normalState";
import {Popup, POPUP, BasicPopupComponent, PopupOptions, PopupContext} from "../../plugins/popup";
import {Positioner, POSITIONER, BasicPositionerComponent} from "../../plugins/positioner";
import {ReadonlyState, READONLY_STATE, ReadonlyStateOptions} from "../../plugins/readonlyState";
import {ValueHandler, VALUE_HANDLER, BasicValueHandlerComponent, ValueHandlerOptions} from "../../plugins/valueHandler";
import {LiveSearch, LIVE_SEARCH, NoLiveSearchComponent} from "../../plugins/liveSearch";
import {TextsLocator, TEXTS_LOCATOR, NoTextsLocatorComponent} from "../../plugins/textsLocator";
import {OptionComponent, NgSelectOption, OptGroupComponent, NgSelectOptGroup} from "../option";

/**
 * Default 'NgSelectOptions'
 * @internal
 */
const defaultOptions: NgSelectOptions<any> =
{
    autoInitialize: true,
    valueComparer: (source, target) =>
    {
        return source == target;
    },
    cssClasses:
    {
    },
    plugins:
    {
        normalState: <PluginDescription<BasicNormalStateComponent>>
        {
            type: forwardRef(() => BasicNormalStateComponent)
        },
        textsLocator: <PluginDescription<NoTextsLocatorComponent>>
        {
            type: forwardRef(() => NoTextsLocatorComponent)
        },
        liveSearch: <PluginDescription<NoLiveSearchComponent>>
        {
            type: forwardRef(() => NoLiveSearchComponent)
        },
        popup: <PluginDescription<BasicPopupComponent>>
        {
            type: forwardRef(() => BasicPopupComponent)
        },
        positioner: <PluginDescription<BasicPositionerComponent>>
        {
            type: forwardRef(() => BasicPositionerComponent)
        },
        keyboardHandler: <PluginDescription<BasicKeyboardHandlerComponent>>
        {
            type: forwardRef(() => BasicKeyboardHandlerComponent)
        },
        readonlyState: <PluginDescription<ReadonlyState>>
        {
            type: forwardRef(() => BasicNormalStateComponent)
        },
        valueHandler: <PluginDescription<BasicValueHandlerComponent<any>>>
        {
            type: forwardRef(() => BasicValueHandlerComponent)
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
    ],
    styles:
    [
        `:host
        {
            display: block;
            position: relative;
        }`
    ]
})
export class NgSelectComponent<TValue> implements NgSelect<TValue>, OnChanges, OnInit, AfterViewInit, OnDestroy, OptionsGatherer<TValue>, TemplateGatherer
{
    //######################### protected fields #########################

    /**
     * NgSelect options
     */
    protected _selectOptions: NgSelectOptions<TValue>;

    /**
     * Subject used for indication that NgSelect was initialized
     */
    private _initializedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Occurs when array of provided options has changed
     */
    protected _optionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Occurs when array of visible, displayed options has changed
     */
    protected _availableOptionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Instance of last options gatherer
     */
    protected _lastOptionsGatherer: OptionsGatherer<TValue>;

    /**
     * Array of available options to be displayed
     */
    protected _availableOptions: NgSelectOption<TValue>[] = [];

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    /**
     * Subscription for changes of live search value
     */
    protected _searchValueChangeSubscription: Subscription;

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

    /**
     * Indication whether should be NgSelect disabled or not
     */
    @Input()
    public disabled: boolean;

    /**
     * Indication whether should be NgSelect readonly or not
     */
    @Input()
    public readonly: boolean;

    //######################### public properties - implementation of NgSelect #########################

    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    public get initialized(): Observable<boolean>
    {
        return this._initializedSubject.asObservable();
    }

    /**
     * Gets current state of initialization
     */
    public isInitialized: boolean = false;

    //######################### public properties - implementation of TemplateGatherer #########################

    /**
     * Template used within normal state
     * @internal
     */
    @ContentChild('normalStateTemplate')
    public normalStateTemplate: TemplateRef<NormalStateContext>;

    /**
     * Template that is used within Popup as option
     * @internal
     */
    @ContentChild('optionTemplate')
    public optionTemplate?: TemplateRef<PopupContext>;

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

    /**
     * Array of visible, displayed options for select
     * @internal
     */
    public get availableOptions(): NgSelectOption<TValue>[]
    {
        return this._availableOptions;
    }

    /**
     * Occurs when array of visible, displayed options has changed
     * @internal
     */
    public get availableOptionsChange(): EventEmitter<void>
    {
        return this._availableOptionsChange;
    }

    /**
     * NgSelect plugin instances available for gatherer
     * @internal
     */
    public ngSelectPlugins: NgSelectPluginInstances;

    //######################### public properties - template bindings #########################

    /**
     * Element used for live search
     * @internal
     */
    public liveSearchElement: HTMLElement[][];

    //######################### public properties - children #########################

    /**
     * Options children found inside ng-select
     * @internal
     */
    @ContentChildren(OptionComponent)
    public optionsChildren: QueryList<NgSelectOption<any>>;

    //######################### public properties - children #########################

    /**
     * Options groups children found inside ng-select
     * @internal
     */
    @ContentChildren(OptGroupComponent)
    public optGroupsChildren: QueryList<NgSelectOptGroup<any>>;

    //######################### constructors #########################
    constructor(protected _changeDetector: ChangeDetectorRef,
                protected _element: ElementRef<HTMLElement>,
                @Inject(NG_SELECT_PLUGIN_INSTANCES) protected _pluginInstances: NgSelectPluginInstances,
                @Inject(NG_SELECT_OPTIONS) @Optional() options?: NgSelectOptions<TValue>,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState>,
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler>,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler<any>>,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>,
                @Inject(TEXTS_LOCATOR) @Optional() textsLocatorType?: Type<TextsLocator>,
                @Attribute('readonly') readonly?: string,
                @Attribute('disabled') disabled?: string,
                @Attribute('multiple') multiple?: string)
    {
        //at least on of following is present (value is not important)
        let readonlyDefault = isPresent(readonly) || isPresent(disabled);
        let multipleDefault = isPresent(multiple);
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

        this._selectOptions = extend(true,
                                     <NgSelectOptions<TValue>>
                                     {
                                         optionsGatherer: this,
                                         templateGatherer: this,
                                         readonly: readonlyDefault,
                                         plugins:
                                         {
                                             popup:
                                             {
                                                 options: <PopupOptions<any>>
                                                 {
                                                     multiple: multipleDefault
                                                 }
                                             },
                                             valueHandler:
                                             {
                                                 options: <ValueHandlerOptions>
                                                 {
                                                     multiple: multipleDefault
                                                 }
                                             }
                                         }
                                     },
                                     defaultOptions,
                                     opts);
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        let updateReadonly = (state: boolean, firstChange: boolean) =>
        {
            //update options
            this.selectOptions.readonly = state;

            if(!firstChange)
            {
                this.initOptions();
                this.initialize();
            }
        };

        if(nameof<NgSelectComponent<TValue>>('disabled') in changes && isBoolean(this.disabled))
        {
            updateReadonly(this.disabled, changes[nameof<NgSelectComponent<TValue>>('disabled')].firstChange);
        }

        if(nameof<NgSelectComponent<TValue>>('readonly') in changes && isBoolean(this.readonly))
        {
            updateReadonly(this.readonly, changes[nameof<NgSelectComponent<TValue>>('readonly')].firstChange);
        }
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
        this._availableOptions = this.options;

        this.optionsChildren.changes.subscribe(() =>
        {
            this._availableOptions = this.options;
            this._optionsChange.emit();
            this._availableOptionsChange.emit();
        });

        if(this._selectOptions.autoInitialize)
        {
            this.initialize();
        }
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._searchValueChangeSubscription)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;
        }

        if(this.selectOptions.optionsGatherer)
        {
            this.selectOptions.optionsGatherer.destroyGatherer();
        }
    }

    //######################### public methods - implementation of OptionsGatherer #########################

    /**
     * Initialize gatherer during initialization phase
     * @internal
     */
    public initializeGatherer(): void
    {
        let liveSearch = this._pluginInstances[LIVE_SEARCH] as LiveSearch;

        if(this._liveSearch && this._liveSearch != liveSearch)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;

            this._liveSearch = null;
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;

            this._searchValueChangeSubscription = this._liveSearch.searchValueChange.subscribe(() =>
            {
                if(!this._liveSearch.searchValue)
                {
                    this._availableOptions = this.options;
                    this._availableOptionsChange.emit();

                    return;
                }

                //TODO - make option from callback
                this._availableOptions = this.options.filter(itm => itm.text.indexOf(this._liveSearch.searchValue) >= 0);
                this._availableOptionsChange.emit();
            });
        }
    }

    /**
     * Called when gatherer needs to be destroyed
     * @internal
     */
    public destroyGatherer(): void
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Sets normal state component
     * @param {NormalState} normalState Created normal state that is rendered
     * @internal
     */
    public setNormalStateComponent(normalState: NormalState)
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

        normalState.templateGatherer = this.selectOptions.templateGatherer;
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

        keyboardHandler.selectElement = this._element.nativeElement;
        keyboardHandler.optionsGatherer = this.selectOptions.optionsGatherer;
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

        popup.selectElement = this._element.nativeElement;
        popup.optionsGatherer = this.selectOptions.optionsGatherer;
        popup.templateGatherer = this.selectOptions.templateGatherer;
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

        positioner.selectElement = this._element.nativeElement;
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

    /**
     * Sets readonly state component
     * @param {ReadonlyState} readonlyState Created readonly state that is rendered
     * @internal
     */
    public setReadonlyStateComponent(readonlyState: ReadonlyState)
    {
        if(!readonlyState)
        {
            this._pluginInstances[READONLY_STATE] = null;

            return;
        }

        this._pluginInstances[READONLY_STATE] = readonlyState;
        this._pluginInstances[NORMAL_STATE] = readonlyState;

        if(this._selectOptions.plugins && this._selectOptions.plugins.readonlyState && this._selectOptions.plugins.readonlyState.options)
        {
            readonlyState.options = this._selectOptions.plugins.readonlyState.options;
        }

        let options = readonlyState.options as ReadonlyStateOptions<any>;

        options.readonly = true;
        readonlyState.initOptions();

        if(this._selectOptions.plugins && this._selectOptions.plugins.readonlyState && this._selectOptions.plugins.readonlyState.instanceCallback)
        {
            this._selectOptions.plugins.readonlyState.instanceCallback(readonlyState);
        }
    }

    /**
     * Sets value handler component
     * @param {ValueHandler} valueHandler Created value handler that is rendered
     * @internal
     */
    public setValueHandlerComponent(valueHandler: ValueHandler<TValue>)
    {
        if(!valueHandler)
        {
            return;
        }

        this._pluginInstances[VALUE_HANDLER] = valueHandler;

        if(this._selectOptions.plugins && this._selectOptions.plugins.valueHandler && this._selectOptions.plugins.valueHandler.options)
        {
            valueHandler.options = this._selectOptions.plugins.valueHandler.options;
        }

        valueHandler.valueComparer = this.selectOptions.valueComparer;
        valueHandler.optionsGatherer = this.selectOptions.optionsGatherer;
        valueHandler.initOptions();

        if(this._selectOptions.plugins && this._selectOptions.plugins.valueHandler && this._selectOptions.plugins.valueHandler.instanceCallback)
        {
            this._selectOptions.plugins.valueHandler.instanceCallback(valueHandler);
        }
    }

    /**
     * Sets live search component
     * @param {LiveSearch} liveSearch Created live search that is rendered
     * @internal
     */
    public setLiveSearchComponent(liveSearch: LiveSearch)
    {
        if(!liveSearch)
        {
            return;
        }

        this._pluginInstances[LIVE_SEARCH] = liveSearch;

        if(this._selectOptions.plugins && this._selectOptions.plugins.liveSearch && this._selectOptions.plugins.liveSearch.options)
        {
            liveSearch.options = this._selectOptions.plugins.liveSearch.options;
        }

        liveSearch.initOptions();

        if(this._selectOptions.plugins && this._selectOptions.plugins.liveSearch && this._selectOptions.plugins.liveSearch.instanceCallback)
        {
            this._selectOptions.plugins.liveSearch.instanceCallback(liveSearch);
        }
    }

    //######################### public methods #########################

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    public initialize()
    {
        let liveSearchPlugin = this._pluginInstances[LIVE_SEARCH] as LiveSearch;
        this.liveSearchElement = [[liveSearchPlugin.liveSearchElement]];
        this._changeDetector.detectChanges();
        
        this.selectOptions.optionsGatherer.initializeGatherer();

        this._pluginInstances[LIVE_SEARCH].initialize();
        this._pluginInstances[TEXTS_LOCATOR].initialize();
        this._pluginInstances[POSITIONER].initialize();
        this._pluginInstances[KEYBOARD_HANDLER].initialize();
        this._pluginInstances[VALUE_HANDLER].initialize();
        this._pluginInstances[NORMAL_STATE].initialize();
        this._pluginInstances[POPUP].initialize();

        this.isInitialized = true;
        this._initializedSubject.next(true);
    }

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    public initOptions()
    {
        this.selectOptions.optionsGatherer.ngSelectPlugins = this._pluginInstances;

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

                    let normalState = this._pluginInstances[NORMAL_STATE] as NormalState;
                    normalState.templateGatherer = this.selectOptions.templateGatherer;

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

            if(this._selectOptions.plugins.keyboardHandler)
            {
                this._selectOptions.plugins.keyboardHandler.type = resolveForwardRef(this._selectOptions.plugins.keyboardHandler.type);

                if(this._pluginInstances[KEYBOARD_HANDLER])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.keyboardHandler && this._selectOptions.plugins.keyboardHandler.options)
                    {
                        this._pluginInstances[KEYBOARD_HANDLER].options = this._selectOptions.plugins.keyboardHandler.options;
                    }

                    let keyboardHandler = this._pluginInstances[KEYBOARD_HANDLER] as KeyboardHandler;
                    keyboardHandler.selectElement = this._element.nativeElement;
                    keyboardHandler.optionsGatherer = this.selectOptions.optionsGatherer;

                    this._pluginInstances[KEYBOARD_HANDLER].initOptions();
                }
            }

            if(this._selectOptions.plugins.popup)
            {
                this._selectOptions.plugins.popup.type = resolveForwardRef(this._selectOptions.plugins.popup.type);

                if(this._pluginInstances[POPUP])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.popup && this._selectOptions.plugins.popup.options)
                    {
                        this._pluginInstances[POPUP].options = this._selectOptions.plugins.popup.options;
                    }

                    let popup = this._pluginInstances[POPUP] as Popup;
                    popup.selectElement = this._element.nativeElement;
                    popup.optionsGatherer = this.selectOptions.optionsGatherer;
                    popup.templateGatherer = this.selectOptions.templateGatherer;

                    this._pluginInstances[POPUP].initOptions();
                }
            }

            if(this._selectOptions.plugins.positioner)
            {
                this._selectOptions.plugins.positioner.type = resolveForwardRef(this._selectOptions.plugins.positioner.type);

                if(this._pluginInstances[POSITIONER])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.positioner && this._selectOptions.plugins.positioner.options)
                    {
                        this._pluginInstances[POSITIONER].options = this._selectOptions.plugins.positioner.options;
                    }

                    let positioner = this._pluginInstances[POSITIONER] as Positioner;
                    positioner.selectElement = this._element.nativeElement;

                    this._pluginInstances[POSITIONER].initOptions();
                }
            }

            if(this._selectOptions.plugins.readonlyState)
            {
                this._selectOptions.plugins.readonlyState.type = resolveForwardRef(this._selectOptions.plugins.readonlyState.type);

                if(this._pluginInstances[READONLY_STATE])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.readonlyState && this._selectOptions.plugins.readonlyState.options)
                    {
                        this._pluginInstances[READONLY_STATE].options = this._selectOptions.plugins.readonlyState.options;
                    }

                    let options = this._pluginInstances[READONLY_STATE].options as ReadonlyStateOptions<any>;

                    options.readonly = true;
                    this._pluginInstances[READONLY_STATE].initOptions();
                }
            }

            if(this._selectOptions.plugins.valueHandler)
            {
                this._selectOptions.plugins.valueHandler.type = resolveForwardRef(this._selectOptions.plugins.valueHandler.type);

                if(this._pluginInstances[VALUE_HANDLER])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.valueHandler && this._selectOptions.plugins.valueHandler.options)
                    {
                        this._pluginInstances[VALUE_HANDLER].options = this._selectOptions.plugins.valueHandler.options;
                    }

                    let valueHandler = this._pluginInstances[VALUE_HANDLER] as ValueHandler<TValue>;

                    valueHandler.valueComparer = this.selectOptions.valueComparer;
                    this._pluginInstances[VALUE_HANDLER].initOptions();
                }
            }

            if(this._selectOptions.plugins.liveSearch)
            {
                this._selectOptions.plugins.liveSearch.type = resolveForwardRef(this._selectOptions.plugins.liveSearch.type);

                if(this._pluginInstances[LIVE_SEARCH])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins.liveSearch && this._selectOptions.plugins.liveSearch.options)
                    {
                        this._pluginInstances[LIVE_SEARCH].options = this._selectOptions.plugins.liveSearch.options;
                    }

                    this._pluginInstances[LIVE_SEARCH].initOptions();
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