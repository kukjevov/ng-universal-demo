import {Component, ChangeDetectionStrategy, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';
import * as positions from 'positions';

import {BasicPositionerOptions, BasicPositioner} from './basicPositioner.interface';
import {NgSelectPluginGeneric} from '../../../misc';
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
     * Options for NgSelect plugin
     */
    protected _options: BasicPositionerOptions;

    /**
     * Subscription for visibility change of popup
     */
    protected _visibilitySubscription: Subscription;

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
     * Computed coordinates of popup
     */
    public popupCoordinates: Positions.PositionsCss = {};

    /**
     * Occurs when computed coordinates of popup change
     */
    public popupCoordinatesChange: EventEmitter<void> = new EventEmitter<void>();

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

        window.removeEventListener('resize', this._handleResizeAndScroll);
        window.removeEventListener('scroll', this._handleResizeAndScroll);
    }

    //######################### public methods - implementation of BasicPositioner #########################

    /**
     * Initialize plugin, to be ready to use, initialize communication with other plugins
     */
    public initialize()
    {
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
        // this._popupElement.style.minWidth = `${this.selectElement.clientWidth}px`;

        //set to default position
        this.popupCoordinates = positions(this._popupElement, this.options.optionsCoordinates, this.selectElement, this.options.selectCoordinates);
        this._popup.invalidateVisuals();

        //flip if collision with viewport
        this.popupCoordinates = this._flipIfCollision(this._popupElement);
        this._popup.invalidateVisuals();

        //set maxHeight if there is not more place
        if(this._updateHeight(this._popupElement))
        {
            this.popupCoordinates = this._flipIfCollision(this._popupElement);
            this._popup.invalidateVisuals();
        }
    }

    /**
     * Updates height of element
     * @param popupDiv Html element for popup div
     */
    protected _updateHeight(popupDiv: HTMLElement): boolean
    {
        let rect = popupDiv.getBoundingClientRect(),
            selectRect = this.selectElement.getBoundingClientRect(),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0);

        //popup is above
        if(rect.top < selectRect.top)
        {
            //space above is not enough
            if(selectRect.top < rect.height)
            {
                popupDiv.style.maxHeight = `${selectRect.top - 2}px`;

                return true;
            }
            else
            {
                popupDiv.style.maxHeight = '';

                return false;
            }
        }
        //popup is below
        else
        {
            //space below is not enough
            if(h - selectRect.bottom < rect.height)
            {
                popupDiv.style.maxHeight = `${h - selectRect.bottom - 2}px`;

                return true;
            }
            else
            {
                popupDiv.style.maxHeight = '';

                return false;
            }
        }
    }

    /**
     * Flips html element position if collision occur
     * @param popupDiv Html element to be flipped if collisions occur
     */
    protected _flipIfCollision(popupDiv: HTMLElement): Positions.PositionsCss
    {
        let w = Math.max(this._document.documentElement.clientWidth, window.innerWidth || 0),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0),
            rect = popupDiv.getBoundingClientRect(),
            selectRect = this.selectElement.getBoundingClientRect(),
            spaceAbove = selectRect.top,
            spaceUnder = h - selectRect.bottom,
            spaceBefore = selectRect.left,
            spaceAfter = w - selectRect.right,
            optionsCoordinates = this.options.optionsCoordinates,
            selectCoordinates = this.options.selectCoordinates;

        //vertical overflow
        if((h < (rect.top + rect.height) &&
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

        return positions(popupDiv, optionsCoordinates, this.selectElement, selectCoordinates);
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