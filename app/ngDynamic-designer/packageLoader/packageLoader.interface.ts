import {DynamicModule} from "../../ngDynamic-core";

/**
 * Description of package components
 */
export interface PackageComponents
{
    /**
     * Components in package 
     */
    [componentName: string]: DynamicModule;
}