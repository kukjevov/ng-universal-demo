import {Type} from "@angular/core";

import {DynamicComponent} from "../interfaces";

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
}