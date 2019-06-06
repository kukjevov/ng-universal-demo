import {ComponentRef, Directive, Input, NgModuleRef, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef, Injector} from '@angular/core';
import {nameof} from '@asseco/common';

import {ComponentLoader} from '../../componentLoader';
import {DynamicComponent, DynamicComponentMetadata} from '../../interfaces';
import {ComponentManager} from '../../componentManager';
import {ComponentRelationManager} from '../../componentRelationManager';

/**
* Creates dynamically instance of component by its metadata
*/
@Directive(
{
    selector: '[componentRenderer]',
    exportAs: 'componentRenderer'
})
export class ComponentRendererDirective<TComponent extends DynamicComponent> implements OnChanges, OnDestroy
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

    /**
     * Custom injector used as parent for dynamic components tree
     */
    @Input('componentRendererInjector')
    public customInjector: Injector;

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

    /**
     * Called when input value changes
     */
    public async ngOnChanges(changes: SimpleChanges)
    {
        this._viewContainerRef.clear();
        this.ngOnDestroy();

        if(nameof<ComponentRendererDirective<TComponent>>('componentMetadata') in changes && changes[nameof<ComponentRendererDirective<TComponent>>('componentMetadata')].currentValue)
        {
            let injector = this.customInjector || this._viewContainerRef.parentInjector;
            let componentManager = injector.get(ComponentManager);
            let componentRelationsManager = injector.get(ComponentRelationManager);

            await componentRelationsManager.initialize();

            if(this.componentMetadata)
            {
                let resolved = await this._componentLoader.resolveComponentFactory(this.componentMetadata, injector);
    
                if(!resolved)
                {
                    this._componentRef = null;
    
                    return;
                }
    
                this._moduleRef = resolved.module;
                this._componentRef = this._viewContainerRef.createComponent(resolved.factory, this._viewContainerRef.length, injector) as any;
                
                this.component.options = this.componentMetadata.options;
                this.component.invalidateVisuals();
                
                componentManager.registerComponent(this.componentMetadata.id, this.component);
            }
        }
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this.componentMetadata && this.component)
        {
            let injector = this.customInjector || this._viewContainerRef.parentInjector;
            let componentManager = injector.get(ComponentManager);

            if(componentManager.get(this.componentMetadata.id))
            {
                componentManager.unregisterComponent(this.componentMetadata.id);
            }
            
            this._componentRef = null;
        }

        if (this._moduleRef)
        {
            this._moduleRef.destroy();
            this._moduleRef = null;
        }
    }
}
