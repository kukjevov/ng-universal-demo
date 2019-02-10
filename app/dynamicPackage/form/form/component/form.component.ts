import {Component, ChangeDetectionStrategy, ChangeDetectorRef, ExistingProvider, forwardRef, SkipSelf, Optional, Inject, OnInit, OnDestroy} from "@angular/core";
import {AbstractControl, FormGroup, FormBuilder} from "@angular/forms";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {FormComponentOptions, FormComponentApi, FORM_COMPONENT} from "./form.interface";

/**
 * Form component used for grouping form inputs
 */
@Component(
{
    selector: 'form-component',
    templateUrl: 'form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <ExistingProvider>
        {
            provide: FORM_COMPONENT,
            useExisting: forwardRef(() => FormComponent)
        }
    ]
})
export class FormComponent implements DynamicComponentGeneric<FormComponentOptions>, FormComponentApi, OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Form group that represents this form
     */
    private _formGroup: FormGroup;

    /**
     * Indication whether form was submitted
     */
    private _submitted: boolean = false;

    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: FormComponentOptions;

    /**
     * Indicaiton whether form was submitted
     */
    public set submitted(value: boolean)
    {
        if(this._parentForm)
        {
            this._parentForm.submitted = value;
        }
        else
        {
            this._submitted = value;
        }
    }
    public get submitted(): boolean
    {
        if(this._parentForm)
        {
            return this._parentForm.submitted;
        }

        return this._submitted;
    }

    /**
     * Gets indication whether is form valid
     */
    public get valid(): boolean
    {
        return this._formGroup.valid;
    }

    /**
     * Gets current value of form
     */
    public get value(): any
    {
        return this._formGroup.value;
    }

    //######################### constructor #########################
    constructor(formBuilder: FormBuilder,
                private _changeDetector: ChangeDetectorRef,
                @SkipSelf() @Optional() @Inject(FORM_COMPONENT) private _parentForm: FormComponentApi)
    {
        this._formGroup = formBuilder.group({});
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(this._parentForm)
        {
            this._parentForm.registerControl(this.options.name, this._formGroup);
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._parentForm)
        {
            this._parentForm.unregisterControl(this.options.name);
        }
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    /**
     * Registers provided control into the form
     * @param name Name of control to be registered
     * @param control Control to be registered within form
     */
    public registerControl(name: string, control: AbstractControl): void
    {
        this._formGroup.addControl(name, control);
    }

    /**
     * Unregisters provided control from form
     * @param name Name of control to be unregistered
     */
    public unregisterControl(name: string): void
    {
        this._formGroup.removeControl(name);
    }
}