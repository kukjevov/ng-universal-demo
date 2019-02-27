import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Inject, Optional, ElementRef, EventEmitter, OnDestroy} from '@angular/core';
import {extend} from '@asseco/common';
import {Subscription} from 'rxjs';
import * as positions from 'positions';

import {BasicPositionerOptions, BasicPositioner} from './basicPositioner.interface';
import {NgSelectPluginGeneric} from '../../../misc';
import {NG_SELECT_PLUGIN_INSTANCES, NgSelectPluginInstances} from '../../../components/select';
import {POSITIONER_OPTIONS} from '../positioner.interface';
import {POPUP, Popup, PopupOptions} from '../../popup';
import {DOCUMENT} from '@angular/common';

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
    protected _popup: Popup<any>;

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
                protected _changeDetector: ChangeDetectorRef,
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
        let popup: Popup<any> = this.ngSelectPlugins[POPUP] as Popup<any>;

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

        this._popupElement = this._popup.pluginElement.nativeElement;
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
        let popupOptions = this._popup.options as PopupOptions<any>;

        //register events and handle position of opened popup
        if(popupOptions.visible)
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
        this.popupCoordinatesChange.emit();

        //flip if collision with viewport
        this.popupCoordinates = this._flipIfCollision(this._popupElement);
        this.popupCoordinatesChange.emit();

        //set maxHeight if there is not more place
        if(this._updateHeight(this._popupElement))
        {
            this.popupCoordinates = this._flipIfCollision(this._popupElement);
            this.popupCoordinatesChange.emit();
        }
    }

    /**
     * Updates height of element
     * @param optionsDiv Html element for options div
     */
    protected _updateHeight(optionsDiv: HTMLElement): boolean
    {
        let rect = optionsDiv.getBoundingClientRect(),
            selectRect = this.selectElement.getBoundingClientRect(),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0);

        //options are above
        if(rect.top < selectRect.top)
        {
            //space above is not enough
            if(selectRect.top < rect.height)
            {
                optionsDiv.style.maxHeight = `${selectRect.top - 2}px`;

                return true;
            }
            else
            {
                optionsDiv.style.maxHeight = '';

                return false;
            }
        }
        //options are below
        else
        {
            //space below is not enough
            if(h - selectRect.bottom < rect.height)
            {
                optionsDiv.style.maxHeight = `${h - selectRect.bottom - 2}px`;

                return true;
            }
            else
            {
                optionsDiv.style.maxHeight = '';

                return false;
            }
        }
    }

    /**
     * Flips html element position if collision occur
     * @param optionsDiv Html element to be flipped if collisions occur
     */
    protected _flipIfCollision(optionsDiv: HTMLElement): Positions.PositionsCss
    {
        let w = Math.max(this._document.documentElement.clientWidth, window.innerWidth || 0),
            h = Math.max(this._document.documentElement.clientHeight, window.innerHeight || 0),
            rect = optionsDiv.getBoundingClientRect(),
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

        return positions(optionsDiv, optionsCoordinates, this.selectElement, selectCoordinates);
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