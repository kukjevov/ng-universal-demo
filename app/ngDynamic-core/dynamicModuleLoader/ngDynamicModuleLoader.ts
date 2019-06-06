import {ClassProvider} from "@angular/core";
import {noop} from "@asseco/common";

import {DynamicModuleLoader, DynamicModuleDescription, DYNAMIC_MODULE_LOADERS} from "./dynamicModuleLoader.interface";
import {DynamicModule} from "../componentLoader";

/**
 * Default NgDynamic DynamicModuleLoader
 */
export class NgDynamicModuleLoader implements DynamicModuleLoader
{
    /**
     * Tries to load module, if nothing is found returns null
     * @param module Definition of module to be loaded
     */
    public async tryLoadModule(module: DynamicModuleDescription): Promise<DynamicModule>
    {
        let dynamicModule: DynamicModule = await import(`@ngDynamic/${module.componentPackage}/${module.componentName}/importIndex`)
            .catch(noop);

        return dynamicModule;
    }
}

/**
 * Default provider for ngDynamicModuleLoader
 */
export const NG_DYNAMIC_MODULE_LOADERS_PROVIDER: ClassProvider =
{
    provide: DYNAMIC_MODULE_LOADERS,
    useClass: NgDynamicModuleLoader,
    multi: true
};