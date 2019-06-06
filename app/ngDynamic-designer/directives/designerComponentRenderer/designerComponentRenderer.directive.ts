import {ComponentRef, Directive, Input, NgModuleRef, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef, Injector, SkipSelf, ChangeDetectorRef} from '@angular/core';
import {nameof, generateId} from '@asseco/common';

import {ComponentLoader} from '../../../ngDynamic-core';
import {DesignerLayoutPlaceholderComponent, DesignerLayoutComponentRendererData} from '../../interfaces';
import {ComponentsService} from '../../services';

/**
* Creates dynamically instance of component by its dynamicModule used for layout designer
*/
@Directive(
{
    selector: '[designerComponentRenderer]',
    exportAs: 'designerComponentRenderer'
})
export class DesignerComponentRendererDirective<TComponent extends DesignerLayoutPlaceholderComponent> implements OnChanges, OnDestroy
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
     * Loaded module that should be rendered
     */
    @Input('designerComponentRenderer')
    public componentMetadata: DesignerLayoutComponentRendererData;

    /**
     * Custom injector used as parent for dynamic components tree
     */
    @Input('designerComponentRendererInjector')
    public customInjector: Injector;

    //######################### public properties #########################

    /**
     * Instance of dynamically created component
     */
    public get component(): TComponent|null
    {
        if(!this._componentRef)
        {
            return null;
        }

        return this._componentRef.instance;
    }

    //######################### constructor #########################
    constructor(private _viewContainerRef: ViewContainerRef,
                private _componentsSvc: ComponentsService,
                @SkipSelf() private _parentChangeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public async ngOnChanges(changes: SimpleChanges)
    {
        this.ngOnDestroy();
        this._viewContainerRef.clear();

        if(nameof<DesignerComponentRendererDirective<TComponent>>('componentMetadata') in changes && changes[nameof<DesignerComponentRendererDirective<TComponent>>('componentMetadata')].currentValue)
        {
            let injector = this.customInjector || this._viewContainerRef.parentInjector;
            let resolved = await ComponentLoader.resolveComponentFactory(this.componentMetadata.designerMetadata.placeholderModule, injector, this.componentMetadata.componentName);

            if(!resolved)
            {
                this._componentRef = null;

                return;
            }

            this._moduleRef = resolved.module;
            this._componentRef = this._viewContainerRef.createComponent(resolved.factory, this._viewContainerRef.length, injector) as any;

            this.component.options = this.componentMetadata.designerMetadata.layoutMetadata;
            await this.component.setMetadata(this.componentMetadata.componentMetadata ||
            {
                id: generateId(12),
                options: null,
                componentName: this.componentMetadata.componentName,
                componentPackage: this.componentMetadata.packageName
            });
            
            this.component.invalidateVisuals();
            this._parentChangeDetector.detectChanges();
            this._componentsSvc.addComponent(this.component);

            return;
        }

        this._componentRef = null;
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._componentsSvc.removeComponent(this.component);

        if (this._moduleRef)
        {
            this._moduleRef.destroy();
            this._moduleRef = null;
        }
    }
}
