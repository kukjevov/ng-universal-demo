import {Component, ChangeDetectionStrategy, Input} from "@angular/core";
import {FormControl} from "@angular/forms";

import {PropertiesPropertyMetadata, PropertyType} from "../../../interfaces";

/**
 * Represents single property form and its value
 */
@Component(
{
    selector: 'div[property]',
    templateUrl: 'property.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComponent
{
    //######################### public properties - template bindings #########################

    /**
     * PropertyType enum
     */
    public propertyTypes = PropertyType;

    //######################### public properties - inputs #########################

    /**
     * Definition of property metadata
     */
    @Input()
    public property: PropertiesPropertyMetadata;

    /**
     * Form control that is attached to html
     */
    @Input()
    public control: FormControl;

    /**
     * Indication that this is array item and description should not be shown
     */
    @Input()
    public arrayItem: boolean = false;
}