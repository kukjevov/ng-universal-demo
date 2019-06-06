import {Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

import {PackageLoader} from "../../packageLoader";
import {ComponentPalettePackage} from "./componentPalette.interface";

/**
 * Component used for displaying component palette in designer
 */
@Component(
{
    selector: 'designer-component-palette',
    templateUrl: 'componentPalette.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentPaletteComponent implements OnDestroy
{
    //######################### private properties #########################

    /**
     * Subscription for changes of registered components
     */
    private _componentsChangeSubscription: Subscription;

    //######################### public properties - inputs #########################

    /**
     * Package names
     */
    @Input()
    public set packageNames(packageNames: string[])
    {        
        this._loadPackages(packageNames);
    };

    //######################### public properties - template bindings #########################

    /**
     * Available component packages for designer
     */
    public packages: ComponentPalettePackage[];

    //######################### constructor #########################
    constructor(private _packageLoader: PackageLoader,
                private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if (this._componentsChangeSubscription)
        {
            this._componentsChangeSubscription.unsubscribe();
            this._componentsChangeSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals()
    {
        this._changeDetector.detectChanges();
    }

    //######################### private methods #########################

    /**
     * Loads specified components packages
     * @param packageNames packageNames to be loaded
     */
    private async _loadPackages(packageNames: string[])
    {
        this.packages = [];

        if (!packageNames)
        {
            this._changeDetector.detectChanges();
            return;
        }
            
        for (var i = 0; i < packageNames.length; i++)
        {
            let components = await this._packageLoader.getPackageComponentsMetadata(packageNames[i]);
            if (Object.keys(components).length)
            {
                this.packages.push(
                    {
                        packageName: packageNames[i],
                        components: Object.keys(components).map(componentName => {
                            return {
                                componentName: componentName,
                                designerMetadata: components[componentName]
                            } 
                        })
                    }
                );
            }
        }

        this._changeDetector.detectChanges();
    }
}