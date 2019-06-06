import {InjectionToken} from "@angular/core";

import {DynamicModule} from "../componentLoader";

/**
 * Injection token used for injecting dynamic module loaders used for loading dynamic modules
 */
export const DYNAMIC_MODULE_LOADERS: InjectionToken<DynamicModuleLoader[]> = new InjectionToken<DynamicModuleLoader[]>('NG_DYNAMIC_MODULE_LOADERS');

/**
 * Description of dynamic module for DynamicModuleLoader
 */
export interface DynamicModuleDescription
{
    /**
     * Name of npm package (directory) storing component
     */
    componentPackage: string;

    /**
     * Name of component to be displayed
     */
    componentName: string;
}

/**
 * Dynamic module loader description used for dynamic loading of modules
 */
export interface DynamicModuleLoader
{
    /**
     * Tries to load module, if nothing is found returns null
     * @param module Definition of module to be loaded
     */
    tryLoadModule(module: DynamicModuleDescription): Promise<DynamicModule>;
}