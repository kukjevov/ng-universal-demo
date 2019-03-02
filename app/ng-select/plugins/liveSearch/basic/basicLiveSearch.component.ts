import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicLiveSearchOptions, BasicLiveSearch} from './basicLiveSearch.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {LIVE_SEARCH_OPTIONS, LiveSearchTexts} from '../liveSearch.interface';
import {TextsLocator, TEXTS_LOCATOR} from '../../textsLocator';
import {Popup, POPUP} from '../../popup';

/**
 * Default options for live search
 * @internal
 */
const defaultOptions: BasicLiveSearchOptions =
{
    cssClasses:
    {
        wrapperDiv: 'wrapper-div',
        input: 'form-control'
    },
    texts:
    {
        inputPlaceholder: 'Filter options'
    }
};

/**
 * Component used for obtaining basic live search html element
 */
@Component(
{
    selector: "ng-basic-live-search",
    templateUrl: 'basicLiveSearch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
        `.wrapper-div
        {
            padding: 4px;
            border-bottom: 1px solid #666;
            margin-bottom: 2px;
        }
        
        .form-control
        {
            width: 100%;
        }`
    ]
})
export class BasicLiveSearchComponent implements BasicLiveSearch, NgSelectPluginGeneric<BasicLiveSearchOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Texts locator used for handling texts
     */
    protected _textsLocator: TextsLocator;

    /**
     * Popup used in NgSelect
     */
    protected _popup: Popup;

    /**
     * Subscription for changes in texts
     */
    protected _textsChangedSubscription: Subscription;

    /**
     * Subscription for changes of popup visibility
     */
    protected _visibilityChangeSubscription: Subscription;

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicLiveSearchOptions;

    //######################### public properties - implementation of BasicLiveSearch #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicLiveSearchOptions
    {
        return this._options;
    }
    public set options(options: BasicLiveSearchOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * HTML element that represents live search
     */
    public get liveSearchElement(): HTMLElement
    {
        return this.liveSearchElementChild.nativeElement;
    }

    /**
     * Current value of live search
     */
    public searchValue: string = null;

    /**
     * Occurs when current value of live search changes
     */
    public searchValueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - template bindings #########################

    /**
     * Object containing available texts
     * @internal
     */
    public texts: LiveSearchTexts = {};

    //######################### public properties - children #########################

    /**
     * View child that represents live search element
     * @internal
     */
    @ViewChild('liveSearchElement')
    public liveSearchElementChild: ElementRef<HTMLElement>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(LIVE_SEARCH_OPTIONS) @Optional() options?: BasicLiveSearchOptions)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._visibilityChangeSubscription)
        {
            this._visibilityChangeSubscription.unsubscribe();
            this._visibilityChangeSubscription = null;
        }

        if(this._textsChangedSubscription)
        {
            this._textsChangedSubscription.unsubscribe();
            this._textsChangedSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicLiveSearch #########################

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

        let popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._visibilityChangeSubscription.unsubscribe();
            this._visibilityChangeSubscription = null;

            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;

            this._visibilityChangeSubscription = this._popup.visibilityChange.subscribe(() =>
            {
                this.searchValue = '';
                this.searchValueChange.emit();
            });
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

    //######################### public methods - template bindings #########################

    /**
     * Handle input value
     * @param value Value of input
     * @internal
     */
    public handleInput(value: string)
    {
        this.searchValue = value;
        this.searchValueChange.emit();
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