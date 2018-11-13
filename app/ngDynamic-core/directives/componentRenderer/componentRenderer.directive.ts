import {ComponentRef, Directive, Input, NgModuleRef, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef} from '@angular/core';

import {DynamicComponentMetadata} from '../../interfaces/metadata/dynamicComponent.metadata';
import {ComponentLoader} from '../../componentLoader';
    
/**
* Creates dynamically instance of component by its metadata
*/
@Directive(
{
    selector: '[componentRenderer]',
    exportAs: 'componentRenderer'
})
export class ComponentRendererDirective<TComponent> implements OnChanges, OnDestroy
{
    //######################### private fields #########################

    /**
     * Created component reference
     */
    private _componentRef: ComponentRef<TComponent>|null = null;

    /**
     * Created custom module reference
     */
    private _moduleRef: NgModuleRef<any>|null = null;

    //######################### public properties - inputs #########################

    /**
     * Type that should be dynamically created into current container
     */
    @Input('componentRenderer') 
    public componentMetadata: DynamicComponentMetadata;

    //######################### private properties #########################

    /**
     * Instance of dynamically created component 
     */
    private get component(): TComponent|null
    {
        if(!this._componentRef)
        {
            return null;
        }

        return this._componentRef.instance;
    }

    //######################### constructor #########################
    constructor(private _viewContainerRef: ViewContainerRef,
                private _componentLoader: ComponentLoader)
    {
    }

    //######################### public methods - implementation of OnChanges #########################
    public async ngOnChanges(changes: SimpleChanges)
    {
        this._viewContainerRef.clear();
        this._componentRef = null;

        if (this._moduleRef)
        {
            this._moduleRef.destroy();
        }

        console.log(this.component);

        let resolved = await this._componentLoader.resolveComponentFactory<TComponent>(this.componentMetadata, this._viewContainerRef.parentInjector);
        this._moduleRef = resolved.module;        
        this._componentRef = this._viewContainerRef.createComponent<TComponent>(resolved.factory, this._viewContainerRef.length, this._viewContainerRef.parentInjector);
    }

    //######################### public methods - implementation of OnDestroy #########################
    public ngOnDestroy()
    {
        if (this._moduleRef)
        {
            this._moduleRef.destroy();
        }
    }
}
