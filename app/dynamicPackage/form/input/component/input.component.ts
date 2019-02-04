import {Component, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, Inject, OnInit, OnDestroy} from "@angular/core";
import {FormBuilder, FormControl} from "@angular/forms";

import {DynamicComponentGeneric} from "../../../../ngDynamic-core";
import {InputComponentOptions} from "./input.interface";
import {FORM_COMPONENT, FormComponentApi} from "../../form/component";

/**
 * Form input component used for rendering input
 */
@Component(
{
    selector: 'form-input-component',
    templateUrl: 'input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements DynamicComponentGeneric<InputComponentOptions>, OnInit, OnDestroy
{
    //######################### public properties - template bindings #########################
    
    /**
     * Form control that represents this input
     */
    public formControl: FormControl;

    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: InputComponentOptions;

    //######################### constructor #########################
    constructor(formBuilder: FormBuilder,
                private _changeDetector: ChangeDetectorRef,
                @SkipSelf() @Inject(FORM_COMPONENT) private _parentForm: FormComponentApi)
    {
        this.formControl = formBuilder.control(null);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this._parentForm.registerControl(this.options.name, this.formControl);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._parentForm.unregisterControl(this.options.name);
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }
}