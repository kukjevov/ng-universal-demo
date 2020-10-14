import {ApplicationRef, ComponentFactoryResolver, ComponentRef, ContentChild, Directive, ElementRef, EmbeddedViewRef, HostListener, Injector, Input, TemplateRef} from '@angular/core';
import {positionsWithFlip} from '@anglr/common/positions';

import {TooltipComponent} from '../../components';
import {TooltipOptions, TooltipRenderer} from '../../misc/tooltip.interface';

/**
 * Directive used for rendering tooltip
 */
@Directive(
{
    selector: "[tooltip]"
})
export class TooltipDirective<TData = any>
{
    //######################### protected fields #########################

    /**
     * Instance of component used for rendering tooltip
     */
    protected _tooltipComponent?: ComponentRef<TooltipRenderer>;

    /**
     * Instance of HTML element for tooltip renderer
     */
    protected _tooltipElement?: HTMLElement;

    /**
     * Instance of options provided for this tooltip
     */
    protected _options: TooltipOptions;

    //######################### public properties - inputs #########################

    /**
     * Tooltip text that is displayed, or any data that could be passed to template
     */
    @Input()
    public tooltip?: TData|string;

    /**
     * Indication whether are html tags allowed in tooltip text
     */
    @Input()
    public allowHtml: boolean = false;

    /**
     * Instance of tooltip template that is used for rendering
     */
    @Input()
    public tooltipTemplate?: TemplateRef<any>;

    /**
     * Options used for displaying tooltip
     */
    @Input()
    public get tooltipOptions(): TooltipOptions
    {
        return this._options;
    }
    public set tooltipOptions(value: TooltipOptions)
    {
        console.log(value);
    }

    //######################### public properties - children #########################

    /**
     * Instance of template from element content, used for rendering
     */
    @ContentChild('tooltipTemplate')
    public tooltipTemplateChild?: TemplateRef<any>;

    //######################### constructor #########################
    constructor(protected _componentFactoryResolver: ComponentFactoryResolver,
                protected _appRef: ApplicationRef,
                protected _injector: Injector,
                protected _element: ElementRef<HTMLElement>)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._destroyTooltip();
    }

    //######################### public methods - host #########################

    /**
     * Handles mouse enter event, hover start
     * @param event - Mouse event that occured
     * @internal
     */
    @HostListener('mouseenter', ['$event'])
    public mouseEnter(_event: MouseEvent)
    {
        this._createTooltip();
        this._showData();
        positionsWithFlip(this._tooltipElement, 'bottom left', this._element.nativeElement, 'top left');
    }

    /**
     * Handles mouse leave event, hover ends
     * @param event - Mouse event that occured
     * @internal
     */
    @HostListener('mouseleave', ['$event'])
    public mouseLeave(_event: MouseEvent)
    {
        this._destroyTooltip();
    }

    //######################### protected methods #########################

    /**
     * Destroys tooltip component
     */
    protected _destroyTooltip()
    {
        if(this._tooltipComponent)
        {
            this._appRef.detachView(this._tooltipComponent.hostView);
            this._tooltipComponent.destroy();
            this._tooltipComponent = null;
            this._tooltipElement = null;
        }
    }

    /**
     * Creates tooltip renderer component
     */
    protected _createTooltip()
    {
        //do not reinitialize if already exists and nothing has changed
        // if(this._absolutePopupType == component && this.liveSearchElement[0][0] == this._absolutePopupElement)
        // {
        //     return;
        // }

        // 0. Destroyes absolute popup if it exists
        this._destroyTooltip();

        // if(!component)
        // {
        //     return;
        // }

        // 1. Create a component reference from the component 
        this._tooltipComponent = this._componentFactoryResolver
            .resolveComponentFactory(TooltipComponent)
            .create(this._injector);
        
        // 2. Attach component to the appRef so that it's inside the ng component tree
        this._appRef.attachView(this._tooltipComponent.hostView);
        
        // 3. Get DOM element from component
        this._tooltipElement = (this._tooltipComponent.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
        
        // 4. Append DOM element to the body
        document.body.appendChild(this._tooltipElement);
    }

    /**
     * Sets data to tooltip component and shows them
     */
    protected _showData()
    {
        if(this._tooltipComponent)
        {
            this._tooltipComponent.instance.allowHtml = this.allowHtml;
            this._tooltipComponent.instance.data = this.tooltip;
            // this._tooltipComponent.instance.template
            this._tooltipComponent.instance.invalidateVisuals();
        }
    }
}