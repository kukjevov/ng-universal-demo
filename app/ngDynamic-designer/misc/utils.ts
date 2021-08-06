import {getValue, isPresent, setValue} from '@jscrpt/common';

import {PropertiesPropertyMetadata, PropertyType} from '../interfaces';

/**
 * Transforms component or node options to properties
 * @param properties Properties descriptors
 * @param options Options instance
 */
export function transformOptionsToProperties(properties: PropertiesPropertyMetadata[], options: any)
{
    const propertiesOptions = {};

    if(!properties)
    {
        return propertiesOptions;
    }

    properties.forEach(property =>
    {
        //handles collection
        if(property.type == PropertyType.Collection)
        {
            const collection = getValue(options, property.id);
            const propertyCollections = [];
            
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
            const value = getValue(options, property.id);

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
    const options = {};

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
                const array = [];
                setValue(options, array, property.id);

                if(!Array.isArray(value[property.id]) || !Array.isArray(property.arrayItemProperty))
                {
                    return;
                }

                const collection = value[property.id];

                collection.forEach(colItem =>
                {
                    const item = transformPropertiesToOptions(property.arrayItemProperty, colItem);
                    array.push(item);
                });
            }
            //handles simple type
            else
            {
                const val = isPresent(value[property.id]) ? value[property.id] : null;

                setValue(options, val, property.id);
            }
        });
    }

    return options;
}