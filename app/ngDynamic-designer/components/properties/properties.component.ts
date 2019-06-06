import {Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {FormControl, FormGroup, Validators, FormArray} from "@angular/forms";
import {isFunction} from "@asseco/common";
import {Subscription} from "rxjs";

import {PropertiesService} from "../../services";
import {PropertiesMetadata, PropertyType, PropertiesPropertyMetadata, INVALIDATE_PROPERTIES, INVALIDATE_ID} from "../../interfaces";

/**
 * Component used for rendering and editing dynamic node properties
 */
@Component(
{
    selector: 'properties',
    templateUrl: 'properties.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host:
    {
        "[style.display]": "'block'",
        "[style.maxHeight]": "'100%'",
        "[style.overflow]": "'auto'"
    }
})
export class PropertiesComponent implements OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for changes of properties
     */
    private _propertiesChangeSubscription: Subscription;

    /**
     * Subscription for changes of id value
     */
    private _idValueChangeSubscription: Subscription;

    /**
     * Subscription for changes of properties value
     */
    private _propertiesValueChangeSubscription: Subscription;

    /**
     * Currently loaded and displayed properties metadata
     */
    private _propertiesMetadata: PropertiesMetadata;

    /**
     * Indicates whether properties being loaded
     */
    private _isLoadingProperties: boolean;

    //######################### public properties - template bindings #########################

    /**
     * PropertyType enum
     */
    public propertyTypes = PropertyType;

    /**
     * Control used for editing id of dynamic node
     */
    public idControl: FormControl;

    /**
     * Control used for editing properties of dynamic node
     */
    public propertiesForm: FormGroup;

    /**
     * Returns properties metadata of dynamic node
     */
    public get propertiesMetadata(): PropertiesMetadata
    {
        return this._propertiesMetadata;
    }

    //######################### constructor #########################
    constructor(private _propertiesSvc: PropertiesService,
                private _changeDetector: ChangeDetectorRef)
    {
        this.idControl = new FormControl(null, [Validators.required]);
        this.propertiesForm = new FormGroup({});

        this._idValueChangeSubscription = this.idControl.valueChanges.subscribe(value =>
        {
            if(this._propertiesMetadata)
            {
                this._propertiesMetadata.id = value;
                this._propertiesMetadata.dynamicNodeInstance.invalidateVisuals(INVALIDATE_ID);
            }
        });

        this._propertiesValueChangeSubscription = this.propertiesForm.valueChanges.subscribe(propertiesValue =>
        {
            if (this._isLoadingProperties)
            {
                return;
            }

            this._propertiesMetadata.value = propertiesValue;
            this._propertiesMetadata.dynamicNodeInstance.invalidateVisuals(INVALIDATE_PROPERTIES);
        });

        this._propertiesChangeSubscription = this._propertiesSvc.loadProperties.subscribe(properties =>
        {
            this._propertiesMetadata = properties;
            this._loadProperties();

            this._changeDetector.detectChanges();
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._propertiesChangeSubscription)
        {
            this._propertiesChangeSubscription.unsubscribe();
            this._propertiesChangeSubscription = null;
        }

        if(this._idValueChangeSubscription)
        {
            this._idValueChangeSubscription.unsubscribe();
            this._idValueChangeSubscription = null;
        }

        if(this._propertiesValueChangeSubscription)
        {
            this._propertiesValueChangeSubscription.unsubscribe();
            this._propertiesValueChangeSubscription = null;
        }
    }

    //######################### public methods - template bindings #########################

    /**
     * Adds item to collection
     * @param metadata Property metadata for obtaining subobptions
     * @param array Form array which will have new item
     */
    public addCollectionItem(metadata: PropertiesPropertyMetadata, array: FormArray)
    {
        this._isLoadingProperties = true;

        if(!metadata.arrayItemProperty)
        {
            throw new Error(`Unable to get array item properties for '${metadata.name}'!`);
        }

        let group = new FormGroup({});
        array.push(group);

        metadata.arrayItemProperty.forEach(property =>
        {
            group.addControl(property.id, new FormControl(this._getDefaultValue(property), property.validators || []));
        });

        this._isLoadingProperties = false;
    }

    /**
     * Adds item to array
     * @param metadata Property metadata for obtaining subobptions
     * @param array Form array which will have new item
     */
    public addArrayItem(metadata: PropertiesPropertyMetadata, array: FormArray)
    {
        this._isLoadingProperties = true;

        let control = new FormControl(null, metadata.validators || []);
        array.push(control);

        this._isLoadingProperties = false;
    }

    //######################### private methods #########################

    /**
     * Loads properties and creates form
     */
    private _loadProperties()
    {
        this._isLoadingProperties = true;

        //clear all previous controls
        if(this.propertiesForm.controls)
        {
            Object.keys(this.propertiesForm.controls).forEach(controlName =>
            {
                this.propertiesForm.removeControl(controlName);
            });
        }

        if(this._propertiesMetadata && this._propertiesMetadata.properties && this._propertiesMetadata.properties.length)
        {
            this._propertiesMetadata.properties.forEach(property =>
            {
                //Collection properties
                if(property.type == PropertyType.Collection)
                {
                    let array = new FormArray([], property.validators || []);
                    this.propertiesForm.addControl(property.id, array);

                    if(this._propertiesMetadata.value &&
                       this._propertiesMetadata.value[property.id] &&
                       this._propertiesMetadata.value[property.id].length &&
                       property.arrayItemProperty &&
                       property.arrayItemProperty.length)
                    {
                        this._propertiesMetadata.value[property.id].forEach(() =>
                        {
                            let group = new FormGroup({});
                            array.push(group);

                            property.arrayItemProperty.forEach(prop =>
                            {
                                group.addControl(prop.id, new FormControl(this._getDefaultValue(prop), prop.validators || []));
                            });
                        });
                    }
                }
                //array property
                else if(property.type == PropertyType.Array)
                {
                    let array = new FormArray([], property.validators || []);
                    this.propertiesForm.addControl(property.id, array);

                    if(this._propertiesMetadata.value &&
                       this._propertiesMetadata.value[property.id] &&
                       this._propertiesMetadata.value[property.id].length)
                    {
                        this._propertiesMetadata.value[property.id].forEach(() =>
                        {
                            let control = new FormControl(null, property.validators || []);
                            array.push(control);
                        });
                    }
                }
                //single property
                else
                {
                    this.propertiesForm.addControl(property.id, new FormControl(this._getDefaultValue(property), property.validators || []));
                }
            });

            if (this._propertiesMetadata.value)
            {
                this.propertiesForm.patchValue(this._propertiesMetadata.value, {emitEvent: false});
            }
        }

        this._isLoadingProperties = false;
    }

    /**
     * Gets default value for property
     * @param property Property which contains default value
     */
    private _getDefaultValue(property: PropertiesPropertyMetadata): any
    {
        if(isFunction(property.defaultValue))
        {
            return property.defaultValue();
        }

        return property.defaultValue;
    }
}