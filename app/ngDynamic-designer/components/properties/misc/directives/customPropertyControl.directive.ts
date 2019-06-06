import {Directive, ExistingProvider, forwardRef, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewContainerRef, ComponentRef, NgModuleRef, ComponentFactory, ComponentFactoryResolver} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import {nameof} from "@asseco/common";
import {Subscription} from "rxjs";

import {DynamicModule, ComponentLoader, DynamicComponent} from "../../../../../ngDynamic-core";
import {CustomPropertyComponent} from "../../../../interfaces";

/**
 * Custom property control value accessor
 */
const CUSTOM_PROPERTY_VALUE_ACCESSOR: ExistingProvider =
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => CustomPropertyControlDirective), 
    multi: true
};

/**
 * Directive that allows custom property control to be used
 */
@Directive(
{
    selector: '[customPropertyControl][formControl]',
    providers: [CUSTOM_PROPERTY_VALUE_ACCESSOR]
})
export class CustomPropertyControlDirective<TComponent extends CustomPropertyComponent> implements ControlValueAccessor, OnChanges, OnDestroy
{
    //######################### private fields #########################
    
    /**
     * Subscription that looks for changes of select
     */
    private _changeSubscription: Subscription = null;

    /**
     * Created component reference
     */
    private _componentRef: ComponentRef<TComponent>|null = null;

    /**
     * Created custom module reference
     */
    private _moduleRef: NgModuleRef<any>|null = null;

    /**
     * Value function that is used for indication that value has changed into model
     */
    private _valueChangeFn: (data: any) => any;

    /**
     * Currently value of control
     */
    private _value: any;

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

    //######################### public properties - inputs #########################

    /**
     * Custom property control definition
     */
    @Input('customPropertyControl')
    public customPropertyType: DynamicModule;

    //######################### constructor #########################
    constructor(private _viewContainerRef: ViewContainerRef,
                private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods #########################

    /**
     * Sets value to select
     */
    public writeValue(value: any): void
    {
        this._value = value;

        if(this.component)
        {
            this.component.setValue(value);
        }
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
        this._valueChangeFn = fn;
        this._registerValueChange();
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(): void
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

        if(nameof<CustomPropertyControlDirective<TComponent>>('customPropertyType') in changes && changes[nameof<CustomPropertyControlDirective<TComponent>>('customPropertyType')].currentValue)
        {
            let injector = this._viewContainerRef.parentInjector;
            let resolved: 
            {
                module?: NgModuleRef<any>;
                factory?: ComponentFactory<DynamicComponent>
            };

            //component is from external module
            if(this.customPropertyType.module)
            {
                resolved = await ComponentLoader.resolveComponentFactory(this.customPropertyType, injector, 'custom property');
            }
            //component is from local module
            else
            {
                resolved =
                {
                    factory: (injector.get(ComponentFactoryResolver) as ComponentFactoryResolver).resolveComponentFactory(this.customPropertyType.component)
                };
            }

            if(!resolved)
            {
                this._componentRef = null;

                return;
            }

            this._moduleRef = resolved.module;
            this._componentRef = this._viewContainerRef.createComponent(resolved.factory, this._viewContainerRef.length, injector) as any;

            this.component.setValue(this._value);
            this._registerValueChange();
            this._changeDetector.detectChanges();

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
        if(this._changeSubscription)
        {
            this._changeSubscription.unsubscribe();
            this._changeSubscription = null;
        }

        if (this._moduleRef)
        {
            this._moduleRef.destroy();
            this._moduleRef = null;
        }
    }

    //######################### private methods #########################

    /**
     * Registers value changes
     */
    private _registerValueChange()
    {
        if(!this.component || !this._valueChangeFn)
        {
            return;
        }

        this._changeSubscription = this.component.valueChange.subscribe(value =>
        {
            this._value = value;
            this._valueChangeFn(value);
        });
    }
}