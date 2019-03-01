import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, OnDestroy, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend, isDescendant} from '@asseco/common';
import {Subscription} from 'rxjs';

import {BasicPopupOptions, BasicPopup} from './basicPopup.interface';
import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {POPUP_OPTIONS} from '../popup.interface';
import {ɵNgSelectOption, NgSelectOption} from '../../../components/option';
import {NormalState, NORMAL_STATE} from '../../normalState';
import {Positioner, POSITIONER} from '../../positioner';
import {KeyboardHandler, KEYBOARD_HANDLER} from '../../keyboardHandler';
import {ValueHandler, VALUE_HANDLER} from '../../valueHandler';

/**
 * Default options for popup
 * @internal
 */
const defaultOptions: BasicPopupOptions =
{
    cssClasses:
    {
        optionChecked: 'fa fa-check',
        optionItemDiv: 'option-item',
        optionItemTextDiv: 'option-item-text',
        popupDiv: 'popup-div'
    },
    visible: false
};

/**
 * Component used for rendering basic popup with options
 */
@Component(
{
    selector: "div.ng-select-popup",
    templateUrl: 'basicPopup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:
    [
        `.popup-div
        {
            position: absolute;
            z-index: 250;
            background-color: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #BBBBBB;
            overflow: auto;
            min-width: 100%;
        }

        .option-item
        {
            padding: 3px 6px;
            display: flex;
            align-items: center;
        }

        .option-item .option-item-text
        {
            min-width: 0;
            flex: 1;
            white-space: nowrap;
        }

        .option-item .option-item-text:hover
        {
            cursor: pointer;
        }

        .option-item .fa-check
        {
            margin-left: 8px;
        }

        .option-item.selected,
        .option-item.active
        {
            background-color: #BBBBBB;
        }

        .option-item:hover
        {
            background-color: #E0E0E0;
            cursor: pointer;
        }`
    ]
})
export class BasicPopupComponent implements BasicPopup, NgSelectPluginGeneric<BasicPopupOptions>, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPopupOptions;

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<any>;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Subscription for click event on normal state
     */
    protected _clickSubscription: Subscription;

    /**
     * Subscription for popup visibility request from keyboard handler
     */
    protected _khPopupVisibilityRequestSubscription: Subscription;

    /**
     * Subscription for popup visibility request from value handler
     */
    protected _vhPopupVisibilityRequestSubscription: Subscription;

    /**
     * Normal state that is displayed
     */
    protected _normalState: NormalState;

    /**
     * Keyboard handler that is used
     */
    protected _keyboardHandler: KeyboardHandler;

    /**
     * Value handler that is used
     */
    protected _valueHandler: ValueHandler<any>;

    //######################### public properties - implementation of BasicPopup #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicPopupOptions
    {
        return this._options;
    }
    public set options(options: BasicPopupOptions)
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

    /**
     * Occurs when user clicks on option, clicked options is passed as argument
     */
    public optionClick: EventEmitter<NgSelectOption<any>> = new EventEmitter<NgSelectOption<any>>();

    /**
     * Occurs when visibility of popup has changed
     */
    public visibilityChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Html element that represents popup itself
     */
    public get popupElement(): HTMLElement
    {
        let ref = this.popupElementChildren.first;

        if(!ref)
        {
            return null;
        }

        return ref.nativeElement;
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of select options available
     * @internal
     */
    public selectOptions: ɵNgSelectOption<any>[];

    /**
     * Positioner used for setting position of popup
     * @internal
     */
    public positioner: Positioner;

    //######################### public properties - children #########################

    /**
     * Watch for visibility of popup div element
     * @internal
     */
    @ViewChildren('popupDiv')
    public popupElementChildren: QueryList<ElementRef<HTMLElement>>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(POPUP_OPTIONS) @Optional() options?: BasicPopupOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this.popupElementChildren.changes.subscribe(() =>
        {
            //handle click outside
            if(this.popupElementChildren.first)
            {
                this._document.addEventListener('mouseup', this._handleClickOutside);
            }
            //unregister handle click outside
            else
            {
                this._document.removeEventListener('mouseup', this._handleClickOutside);
            }

            this.visibilityChange.emit()
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }

        if(this._clickSubscription)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;
        }

        if(this._khPopupVisibilityRequestSubscription)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;
        }

        if(this._vhPopupVisibilityRequestSubscription)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;
        }
    }

    //######################### public methods - implementation of BasicPopup #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
        if(this._optionsGatherer && this._optionsGatherer != this.optionsGatherer)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;

            this._optionsGatherer = null;
        }

        if(!this._optionsGatherer)
        {
            this._optionsGatherer = this.optionsGatherer;

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() => this.loadOptions());
        }

        let normalState = this.ngSelectPlugins[NORMAL_STATE] as NormalState;

        if(this._normalState && this._normalState != normalState)
        {
            this._clickSubscription.unsubscribe();
            this._clickSubscription = null;

            this._normalState = null;
        }

        if(!this._normalState)
        {
            this._normalState = normalState;

            this._clickSubscription = this._normalState.click.subscribe(() => this.togglePopup());
        }

        let positioner = this.ngSelectPlugins[POSITIONER] as Positioner;

        if(this.positioner && this.positioner != positioner)
        {
            this.positioner = null;
        }

        if(!this.positioner)
        {
            this.positioner = positioner;
        }

        let keyboardHandler = this.ngSelectPlugins[KEYBOARD_HANDLER] as KeyboardHandler;

        if(this._keyboardHandler && this._keyboardHandler != keyboardHandler)
        {
            this._khPopupVisibilityRequestSubscription.unsubscribe();
            this._khPopupVisibilityRequestSubscription = null;

            this._keyboardHandler = null;
        }

        if(!this._keyboardHandler)
        {
            this._keyboardHandler = keyboardHandler;

            this._khPopupVisibilityRequestSubscription = this._keyboardHandler.popupVisibilityRequest.subscribe(this._handleVisibilityChange);
        }

        let valueHandler = this.ngSelectPlugins[VALUE_HANDLER] as ValueHandler<any>;

        if(this._valueHandler && this._valueHandler != valueHandler)
        {
            this._vhPopupVisibilityRequestSubscription.unsubscribe();
            this._vhPopupVisibilityRequestSubscription = null;

            this._valueHandler = null;
        }

        if(!this._valueHandler)
        {
            this._valueHandler = valueHandler;

            this._vhPopupVisibilityRequestSubscription = this._valueHandler.popupVisibilityRequest.subscribe(this._handleVisibilityChange);
        }

        this.loadOptions();
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
     * Loads options
     */
    protected loadOptions()
    {
        this.selectOptions = this._optionsGatherer.availableOptions;
        this._changeDetector.detectChanges();
    }

    /**
     * Toggles popup visibility
     */
    protected togglePopup()
    {
        this.options.visible = !this.options.visible;
        this._changeDetector.detectChanges();
    }

    /**
     * Handles click outside of select element
     * @param event Mouse event object
     */
    protected _handleClickOutside = (event: MouseEvent) =>
    {
        if(this.selectElement != event.target && !isDescendant(this.selectElement, event.target as HTMLElement))
        {
            this.togglePopup();
        }
    }

    /**
     * Handles visibility change
     */
    protected _handleVisibilityChange = (visible: boolean) =>
    {
        if(this.options.visible != visible)
        {
            this.options.visible = visible;
            this._changeDetector.detectChanges();
        }
    };
}