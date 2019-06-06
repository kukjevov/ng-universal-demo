import {Injectable, ComponentFactory, Injector, NgModuleRef, ɵNgModuleFactory as NgModuleFactory, Optional, Inject, ComponentFactoryResolver} from "@angular/core";
import {isString} from "@asseco/common";

import {DynamicComponentMetadata, DynamicComponent} from "../interfaces";
import {DynamicModule} from "./componentLoader.interface";
import {DYNAMIC_MODULE_LOADERS, DynamicModuleLoader} from "../dynamicModuleLoader";

/**
 * Loader used for obtaining ComponentFactory from component`s metadata
 */
@Injectable({providedIn: 'root'})
export class ComponentLoader
{
    //######################### private fields #########################

    /**
     * Already resolved cached npm packages
     */
    private _cachedNpmPackage: {[componentPackageName: string]: DynamicModule} = {};

    //######################### constructor #########################
    constructor(@Inject(DYNAMIC_MODULE_LOADERS) @Optional() private _moduleLoaders: DynamicModuleLoader[])
    {
        if(!this._moduleLoaders || !Array.isArray(this._moduleLoaders) || !this._moduleLoaders.length)
        {
            throw new Error('There is no "dynamic module loader" provided!');
        }
    }

    //######################### public methods #########################

    /**
     * Resolves component factory from component metadata
     * @param componentMetadata Metadata that are going to be used for resolving component factory
     * @param parentInjector Injector from view parent
     */
    public async resolveComponentFactory(componentMetadata: DynamicComponentMetadata, parentInjector: Injector): Promise<{factory: ComponentFactory<DynamicComponent>, module: NgModuleRef<any>}>
    {
        this._validate(componentMetadata);

        let componentPackageName = `${componentMetadata.componentPackage}-${componentMetadata.componentName}`;
        let npmPackage: DynamicModule = this._cachedNpmPackage[componentPackageName];

        if(!npmPackage)
        {
            for(let x = (this._moduleLoaders.length - 1); x >= 0; x--)
            {
                let dynamicModule: DynamicModule = await this._moduleLoaders[x].tryLoadModule(componentMetadata);

                if(dynamicModule)
                {
                    npmPackage = dynamicModule;

                    break;
                }
            }

            if(!npmPackage)
            {
                throw new Error(`Unable to obtain '${componentMetadata.componentPackage}' component\`s package.`);
            }
        }

        return ComponentLoader.resolveComponentFactory(npmPackage, parentInjector, componentMetadata.componentName);
    }

    /**
     * Resolves component factory and its ngModule from dynamic module
     * @param dynamicModule Dynamic module to be resolved as component factory
     * @param parentInjector Injector provided from parent to be used
     * @param componentName Name of component used for displaying if error occurs
     */
    public static async resolveComponentFactory(dynamicModule: DynamicModule, parentInjector: Injector, componentName: string): Promise<{factory: ComponentFactory<DynamicComponent>, module: NgModuleRef<any>}>
    {
        let moduleFactory: NgModuleFactory<any>;

        //NgModule provided
        if(dynamicModule.module)
        {
            moduleFactory = new NgModuleFactory(dynamicModule.module);
        }

        //mising component name
        if(!dynamicModule.component)
        {
            throw new Error(`Unable to obtain '${componentName}' component!`);
        }

        //component without module
        if(!moduleFactory)
        {
            let componentResolver: ComponentFactoryResolver = parentInjector.get(ComponentFactoryResolver);

            return {
                factory: componentResolver.resolveComponentFactory(dynamicModule.component),
                module: null
            };
        }

        //with module providers
        let moduleRef = moduleFactory.create(parentInjector);
        let componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(dynamicModule.component);

        return {
            factory: componentFactory,
            module: moduleRef
        };
    }

    //######################### private methods #########################

    /**
     * Validates component`s metadata
     * @param componentMetadata Metadata to be validated
     */
    private _validate(componentMetadata: DynamicComponentMetadata)
    {
        if(!componentMetadata.id || !isString(componentMetadata.id))
        {
            throw new Error(`Component\`s id '${componentMetadata.id}' is not string!`);
        }

        if(!componentMetadata.componentName || !isString(componentMetadata.componentName))
        {
            throw new Error(`Component\`s name '${componentMetadata.id}' is not string!`);
        }

        if(!componentMetadata.componentPackage || !isString(componentMetadata.componentPackage))
        {
            throw new Error(`Component\`s package '${componentMetadata.id}' is not string!`);
        }
    }
}