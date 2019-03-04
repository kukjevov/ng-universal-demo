import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';
import * as positions from 'positions';

import {BasicPositionerOptions, BasicPositioner} from './basicPositioner.interface';
import {NgSelectPluginGeneric, OptionsGatherer} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {POSITIONER_OPTIONS} from '../positioner.interface';
import {POPUP, Popup} from '../../popup';

/**
 * Default options for positioner
 * @internal
 */
const defaultOptions: BasicPositionerOptions =
{
    optionsCoordinates: 'top left',
    selectCoordinates: 'bottom left'
};

/**
 * Component used for positioning popup element
 */
@Component(
{
    selector: "ng-basic-positioner",
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicPositionerComponent implements BasicPositioner, NgSelectPluginGeneric<BasicPositionerOptions>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of previous options gatherer, that is used for obtaining available options
     */
    protected _optionsGatherer: OptionsGatherer<any>;

    /**
     * Options for NgSelect plugin
     */
    protected _options: BasicPositionerOptions;

    /**
     * Subscription for visibility change of popup
     */
    protected _visibilitySubscription: Subscription;

    /**
     * Subscription for changes of options in options gatherer
     */
    protected _optionsChangeSubscription: Subscription;

    /**
     * Popup that is displayed
     */
    protected _popup: Popup;

    /**
     * Html element of popup plugin
     */
    protected _popupElement: HTMLElement;

    //######################### public properties - implementation of BasicPositioner #########################

    /**
     * Options for NgSelect plugin
     */
    public get options(): BasicPositionerOptions
    {
        return this._options;
    }
    public set options(options: BasicPositionerOptions)
    {
        this._options = extend(true, this._options, options);
    }

    /**
     * HTML element that represents select itself
     */
    public selectElement: HTMLElement;

    /**
     * Instance of options gatherer, that is used for obtaining available options
     */
    public optionsGatherer: OptionsGatherer<any>;

    //######################### constructor #########################
    constructor(@Inject(NG_SELECT_PLUGIN_INSTANCES) @Optional() public ngSelectPlugins: NgSelectPluginInstances,
                public pluginElement: ElementRef,
                @Inject(POSITIONER_OPTIONS) @Optional() options?: BasicPositionerOptions,
                @Inject(DOCUMENT) protected _document?: HTMLDocument)
    {
        this._options = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._visibilitySubscription)
        {
            this._visibilitySubscription.unsubscribe();
            this._visibilitySubscription = null;
        }

        if(this._optionsChangeSubscription)
        {
            this._optionsChangeSubscription.unsubscribe();
            this._optionsChangeSubscription = null;
        }

        window.removeEventListener('resize', this._handleResizeAndScroll);
        window.removeEventListener('scroll', this._handleResizeAndScroll);
    }

    //######################### public methods - implementation of BasicPositioner #########################

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

            this._optionsChangeSubscription = this._optionsGatherer.availableOptionsChange.subscribe(() =>
            {
                if(this._popup.popupElement && this.optionsGatherer.availableOptions && this.optionsGatherer.availableOptions.length)
                {
                    this._handlePosition();
                }
            });
        }

        let popup: Popup = this.ngSelectPlugins[POPUP] as Popup;

        if(this._popup && this._popup != popup)
        {
            this._visibilitySubscription.unsubscribe();
            this._visibilitySubscription = null;

            this._popup = null;
        }

        if(!this._popup)
        {
            this._popup = popup;

            this._visibilitySubscription = this._popup.visibilityChange.subscribe(() => this._handlePosition());
        }

        this._handlePosition();
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
     * Handles resize and scroll event
     */
    protected _handleResizeAndScroll = () =>
    {
        this._calculatePositionAndDimensions();
    };

    /**
     * Handles position of popup
     */
    protected _handlePosition()
    {
        this._popupElement = this._popup.popupElement;

        //register events and handle position of opened popup
        if(this._popupElement)
        {
            window.addEventListener('resize', this._handleResizeAndScroll);
            window.addEventListener('scroll', this._handleResizeAndScroll);

            this._handleResizeAndScroll();
        }
        //unregister events
        else
        {
            window.removeEventListener('resize', this._handleResizeAndScroll);
            window.removeEventListener('scroll', this._handleResizeAndScroll);
        }
    }

    /**
     * Calculates positions and dimensions of popup
     */
    protected _calculatePositionAndDimensions()
    {
        //set to default position
        let popupCoordinates = positions(this._popupElement, this.options.optionsCoordinates, this.selectElement, this.options.selectCoordinates);
        this._popupElement.style.left = `${popupCoordinates.left}px`;
        this._popupElement.style.top = `${popupCoordinates.top}px`;
        this._popupElement.style.maxHeight = '';

        //flip if collision with viewport
        let optionsCoordinates: Positions.PositionsCoordinates;
        let selectCoordinates: Positions.PositionsCoordinates;
        [popupCoordinates, optionsCoordinates, selectCoordinates] = this._flipIfCollision(this._popupElement);
        this._popupElement.style.left = `${popupCoordinates.left}px`;
        this._popupElement.style.top = `${popupCoordinates.top}px`;

        //set maxHeight if there is not more place
        this._updateHeight(this._popupElement);
        popupCoordinates = positions(this._popupElement, optionsCoordinates, this.selectElement, selectCoordinates);
        this._popupElement.style.left = `${popupCoordinates.left}px`;
        this._popupElement.style.top = `${popupCoordinates.top}px`;
    }

    /**
     * Updates height of element
     * @param popupElement Html element for popup div
     */
    protected _updateHeight(popupElement: HTMLElement): void
    {
        let rect = popupElement.getBoundingClientRect(),
            selectRect = this.selectElement.getBoundingClientRect(),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0);

        //popup is above
        if(rect.top < selectRect.top)
        {
            //space above is not enough
            popupElement.style.maxHeight = `${selectRect.top - 6}px`;
        }
        //popup is below
        else
        {
            //space below is not enough
            popupElement.style.maxHeight = `${h - selectRect.bottom - 6}px`;
        }
    }

    /**
     * Flips html element position if collision occur
     * @param popupElement Html element to be flipped if collisions occur
     */
    protected _flipIfCollision(popupElement: HTMLElement): [Positions.PositionsCss, Positions.PositionsCoordinates, Positions.PositionsCoordinates]
    {
        let w = Math.max(this._document.documentElement.clientWidth, window.innerWidth || 0),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0),
            rect = popupElement.getBoundingClientRect(),
            selectRect = this.selectElement.getBoundingClientRect(),
            spaceAbove = selectRect.top,
            spaceUnder = h - selectRect.bottom,
            spaceBefore = selectRect.left,
            spaceAfter = w - selectRect.right,
            optionsCoordinates = this.options.optionsCoordinates,
            selectCoordinates = this.options.selectCoordinates;

        //vertical overflow
        if((h < rect.bottom &&
            spaceUnder < spaceAbove) ||
           (rect.top < 0 &&
            spaceAbove < spaceUnder))
        {
            optionsCoordinates = this._flipVertiacal(optionsCoordinates);
            selectCoordinates = this._flipVertiacal(selectCoordinates);
        }

        //horizontal overflow
        if((w < (rect.left + rect.width) &&
            spaceAfter < spaceBefore) ||
           (rect.left < 0 &&
            spaceBefore < spaceAfter))
        {
            optionsCoordinates = this._flipHorizontal(optionsCoordinates);
            selectCoordinates = this._flipHorizontal(selectCoordinates);
        }

        return [positions(popupElement, optionsCoordinates, this.selectElement, selectCoordinates), optionsCoordinates, selectCoordinates];
    }

    /**
     * Flips vertical position
     * @param position Position to be flipped vertically
     */
    protected _flipVertiacal(position: Positions.PositionsCoordinates): Positions.PositionsCoordinates
    {
        if(position.indexOf('top') >= 0)
        {
            return position.replace('top', 'bottom') as Positions.PositionsCoordinates;
        }
        else if(position.indexOf('bottom') >= 0)
        {
            return position.replace('bottom', 'top') as Positions.PositionsCoordinates;
        }

        return position;
    }

    /**
     * Flips horizontal position
     * @param position Position to be flipped horizontally
     */
    protected _flipHorizontal(position: Positions.PositionsCoordinates): Positions.PositionsCoordinates
    {
        if(position.indexOf('right') >= 0)
        {
            return position.replace('right', 'left') as Positions.PositionsCoordinates;
        }
        else if(position.indexOf('left') >= 0)
        {
            return position.replace('left', 'right') as Positions.PositionsCoordinates;
        }

        return position;
    }
}