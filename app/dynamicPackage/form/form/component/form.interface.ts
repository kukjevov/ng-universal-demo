import {AbstractControl} from "@angular/forms";
import {InjectionToken} from "@angular/core";

import {DynamicComponentMetadata} from "../../../../ngDynamic-core";

/**
 * Injection token used for obtaining FormComponent
 */
export const FORM_COMPONENT: InjectionToken<FormComponentApi> = new InjectionToken<FormComponentApi>('FORM_COMPONENT');

/**
 * Represents public API for form component
 */
export interface FormComponentApi
{
    /**
     * Registers provided control into the form
     * @param name Name of control to be registered
     * @param control Control to be registered within form
     */
    registerControl(name: string, control: AbstractControl): void;

    /**
     * Unregisters provided control from form
     * @param name Name of control to be unregistered
     */
    unregisterControl(name: string): void;
}

/**
 * Form component options
 */
export interface FormComponentOptions
{
    /**
     * Array of children that are going to be rendered
     */
    content?: DynamicComponentMetadata;
}