import {getValue, isPresent, setValue} from "@asseco/common";

import {PropertiesPropertyMetadata, PropertyType} from "../interfaces";

/**
 * Transforms component or node options to properties
 * @param properties Properties descriptors
 * @param options Options instance
 */
export function transformOptionsToProperties(properties: PropertiesPropertyMetadata[], options: any)
{
    let propertiesOptions = {};

    if(!properties)
    {
        return propertiesOptions;
    }

    properties.forEach(property =>
    {
        //handles collection
        if(property.type == PropertyType.Collection)
        {
            let collection = getValue(options, property.id);
            let propertyCollections = [];
            
            propertiesOptions[property.id] = propertyCollections;

            if(collection && collection.length)
            {
                collection.forEach(itm =>
                {
                    propertyCollections.push(transformOptionsToProperties(property.arrayItemProperty, itm));
                });
            }
        }
        //handles simple type
        else
        {
            let value = getValue(options, property.id);

            if(isPresent(value))
            {
                propertiesOptions[property.id] = value;
            }
        }
    });

    return propertiesOptions;
}

/**
 * Transforms properties to component or node options
 * @param properties Properties descriptors
 * @param value Node or component options instance
 */
export function transformPropertiesToOptions(properties: PropertiesPropertyMetadata[], value: any): any
{
    let options = {};

    if(!properties || !value)
    {
        return options;
    }

    if(properties.length)
    {
        properties.forEach(property =>
        {
            //handles collection
            if(property.type == PropertyType.Collection)
            {
                let array = [];
                setValue(options, array, property.id);

                if(!Array.isArray(value[property.id]) || !Array.isArray(property.arrayItemProperty))
                {
                    return;
                }

                let collection = value[property.id];

                collection.forEach(colItem =>
                {
                    let item = transformPropertiesToOptions(property.arrayItemProperty, colItem);
                    array.push(item);
                });
            }
            //handles simple type
            else
            {
                let val = isPresent(value[property.id]) ? value[property.id] : null;

                setValue(options, val, property.id);
            }
        });
    }

    return options;
}