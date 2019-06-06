import {Type, NgModuleFactory} from "@angular/core";
import {DynamicComponent} from "../interfaces";

/**
 * Ng module factory promise data
 */
export interface NgModuleFactoryPromise
{
    /**
     * Ng module factory
     */
    ngModuleFactory: NgModuleFactory<any>;
}

/**
 * Dynamic module description
 */
export interface DynamicModule
{
    /**
     * Dynamic component to be rendered
     */
    component: Type<DynamicComponent>;

    /**
     * Dynamic component`s module
     */
    module: Type<any>;

    /**
     * Dynamic compnent`s module factory
     */
    moduleFactory: Promise<NgModuleFactoryPromise>;
}