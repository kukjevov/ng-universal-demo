import {Injectable} from "@angular/core";

import {PackageComponents} from "./packageLoader.interface";
import {DynamicModule} from "../../ngDynamic-core";
import {DesignerLayoutMetadata, DesignerMetadataClass, LayoutMetadata, PropertiesPropertyMetadata} from "../interfaces";

declare var localPackage: string;

/**
 * Loader used for obtaining packages and their components for designer
 */
@Injectable({providedIn: 'root'})
export class PackageLoader
{
    /**
     * Already resolved cached npm packages
     */
    private _cachedNpmPackage: {[packageName: string]: PackageComponents} = {};

    //######################### public methods #########################

    /**
     * Gets package components
     * @param packageName Name of package
     */
    public async getPackageComponentsMetadata(packageName: string): Promise<{[packageName: string]: DesignerLayoutMetadata}>
    {
        await this._loadPackage(packageName);

        let components: {[packageName: string]: DesignerLayoutMetadata} = {};

        Object.keys(this._cachedNpmPackage[packageName]).forEach(componentName =>
        {
            components[componentName] = this._extractMetadata(this._cachedNpmPackage[packageName][componentName]);

            if (!components[componentName])
            {
                delete components[componentName];
            }
        })

        return components;
    }
    
    /**
     * Gets metadata for designer from component
     * @param packageName Name of package
     * @param componentName Name of component which metadata are going to be extracted
     */
    public async getComponentsMetadata(packageName: string, componentName: string): Promise<DesignerLayoutMetadata>
    {
        await this._loadPackage(packageName);

        if(!this._cachedNpmPackage[packageName][componentName])
        {
            throw new Error(`Package '${packageName}' does not contains component '${componentName}'`);
        }

        return this._extractMetadata(this._cachedNpmPackage[packageName][componentName]);
    }

    //######################### private methods #########################

    /**
     * Extracts metadata from modules component
     * @param dynamicModule Module to be checked for component and metadata
     */
    private _extractMetadata(dynamicModule: DynamicModule): DesignerLayoutMetadata
    {
        if(!dynamicModule.component)
        {
            throw new Error('Wrong module, unable to get component for designer');
        }

        let component: DesignerMetadataClass = dynamicModule.component as any;

        if(!component.ɵMetadata)
        {
            return null;
        }

        return {
            placeholderModule: component.ɵMetadata.placeholderModule,
            layoutMetadata: this._copyLayoutMetadata(component.ɵMetadata.layoutMetadata),
            relationsMetadata: component.ɵMetadata.relationsMetadata,
        };
    }

    /**
     * Loads package into cache
     * @param packageName Name of package to be loaded
     */
    private async _loadPackage(packageName: string)
    {
        let npmPackage: PackageComponents = this._cachedNpmPackage[packageName];

        if(!npmPackage)
        {
            //loads custom npm packages dynamicaly
            npmPackage = await import(`${localPackage}${packageName}/designerIndex`)
                .catch(_error =>
                {
                    return null;
                });

            if(!npmPackage)
            {
                //loads npm package dynamicaly
                npmPackage = await import(`@ngDynamic/${packageName}/designerIndex`)
                    .catch(error =>
                    {
                        throw new Error(`Unable to obtain '${packageName}' package, error '${error}'.`);
                    });
            }

            this._cachedNpmPackage[packageName] = npmPackage;
        }
    }

    /**
     * Copies layout metadata
     * @param layoutMetadata Layout template metadata
     */
    private _copyLayoutMetadata(layoutMetadata: LayoutMetadata): LayoutMetadata
    {
        if(!layoutMetadata)
        {
            return null;
        }

        let result: LayoutMetadata =
        {
            name: layoutMetadata.name,
            description: layoutMetadata.description,
            iconCssClass: layoutMetadata.iconCssClass,
            properties: []
        };

        if(layoutMetadata.properties && layoutMetadata.properties.length)
        {
            layoutMetadata.properties.forEach(property =>
            {
                let prop: PropertiesPropertyMetadata = JSON.parse(JSON.stringify(property));

                if(property.customTypeComponent)
                {
                    prop.customTypeComponent = property.customTypeComponent;
                }

                result.properties.push(prop);
            });
        }

        return result;
    }
}