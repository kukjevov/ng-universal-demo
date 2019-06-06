import {NgModule, ModuleWithProviders} from "@angular/core";

import {ComponentRendererDirective} from "../directives";
import {DynamicComponentPageComponent} from "../dynamicComponentPage";
import {NG_DYNAMIC_MODULE_LOADERS_PROVIDER} from "../dynamicModuleLoader";

/**
 * Module for ng dynamic core 
 */
@NgModule(
{
    imports:
    [
    ],
    declarations: 
    [
        ComponentRendererDirective,
        DynamicComponentPageComponent
    ],
    exports:
    [
        ComponentRendererDirective
    ]
})
export class NgDynamicCoreModule
{
    //######################### public methods #########################

    /**
     * Gets NgDynamicCoreModule with providers for root module
     */
    public static forRoot(): ModuleWithProviders 
    {
        return {
            ngModule: NgDynamicCoreModule,
            providers: 
            [
                NG_DYNAMIC_MODULE_LOADERS_PROVIDER
            ]
        };
    }
}