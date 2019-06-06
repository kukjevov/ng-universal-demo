import {ValidatorFn} from "@angular/forms";
import {ValueNamePair} from "@asseco/common";

import {DesignerServiceMetadata} from "../metadata.interface";
import {DynamicModule} from "../../../ngDynamic-core";
import {Observable} from "rxjs";

/**
 * Constant represents name of invalidation for properties of node change
 */
export const INVALIDATE_PROPERTIES: string = 'properties';

/**
 * Constant represents name of invalidation for id of node change
 */
export const INVALIDATE_ID: string = 'id';

/**
 * Metadata used for displaying properties designer
 */
export interface PropertiesMetadata extends DesignerServiceMetadata
{
    /**
     * Array of descriptors for properties 
     */
    properties?: PropertiesPropertyMetadata[];
}

/**
 * Description of single property in properties
 */
export interface PropertiesPropertyMetadata
{
    /**
     * Id or name of option which will be set by this property
     */
    id?: string;

    /**
     * Display name of property displayed for user
     */
    name?: string;

    /**
     * Data type of property
     */
    type?: PropertyType;

    /**
     * Default value that is set when creating empty control
     */
    defaultValue?: any;

    /**
     * Description of property displayed for user
     */
    description?: string;

    /**
     * Array of available values for this property
     */
    availableValues?: ValueNamePair[];

    /**
     * Defines this property as set of properties
     */
    arrayItemProperty?: PropertiesPropertyMetadata[];

    /**
     * Array of validators that can be applied to property
     */
    validators?: ValidatorFn[];

    /**
     * Indication whether this property should be visible in properties component
     */
    hidden?: boolean;

    /**
     * Contains custom type component definition
     */
    customTypeComponent?: DynamicModule;
}

/**
 * Available data types of property
 */
export enum PropertyType
{
    /**
     * Item will be string, represented as text box
     */
    String,

    /**
     * Item will be string, transformed to number
     */
    Number,

    /**
     * Item will be boolean value, represented as checkbox
     */
    Boolean,

    /**
     * Item will have string value but it will be offered from availableValues
     */
    Options,

    /**
     * Item is array of simple values
     */
    Array,

    /**
     * Item is collection of objects, each object is described by arrayItemProperty
     */
    Collection,

    /**
     * Custom type that can added to properties, usually means object with custom component for displaying it
     */
    CustomType
}

/**
 * Definition of custom property component
 */
export interface CustomPropertyComponent
{
    /**
     * Sets value for custom property
     * @param value Value to be set for this component
     */
    setValue(value: any);

    /**
     * Occurs when custom property value changes
     */
    readonly valueChange: Observable<any>;
}

/**
 * Definition of custom property component generic
 */
export interface CustomPropertyComponentGeneric<TValue> extends CustomPropertyComponent
{
    /**
     * Sets value for custom property
     * @param value Value to be set for this component
     */
    setValue(value: TValue);

    /**
     * Occurs when custom property value changes
     */
    readonly valueChange: Observable<TValue>;
}