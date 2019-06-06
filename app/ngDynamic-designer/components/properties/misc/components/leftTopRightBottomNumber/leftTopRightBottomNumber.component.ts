import {Component, ChangeDetectionStrategy} from "@angular/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {Observable, Subject} from "rxjs";

import {DynamicComponent} from "../../../../../../ngDynamic-core";
import {CustomPropertyComponentGeneric} from "../../../../../interfaces";

/**
 * Component used for rendering custom properties that needs to set left, top, right, bottom object with numbers
 */
@Component(
{
    selector: 'left-top-right-bottom',
    templateUrl: 'leftTopRightBottomNumber.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftTopRightBottomNumberComponent implements DynamicComponent, CustomPropertyComponentGeneric<any>
{
    //######################### private fields #########################

    /**
     * Subject used for emitting changes of value
     */
    private _valueChangeSubject: Subject<any> = new Subject<any>();

    //######################### public properties - template bindings #########################

    /**
     * Form that stores values for padding sides
     */
    public form: FormGroup;

    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: any;

    /**
     * Occurs when custom property value changes
     */
    public get valueChange(): Observable<any>
    {
        return this._valueChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(formBuilder: FormBuilder)
    {
        this.form = formBuilder.group(
        {
            left: null,
            right: null,
            top: null,
            bottom: null
        });

        this.form.valueChanges.subscribe(value =>
        {
            this._valueChangeSubject.next(value);
        });
    }

    //######################### public methods #########################
    
    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     * @param initial Indication whether is invalidation initial, or on event
     */
    public invalidateVisuals(propertyName?: string, initial?: boolean): void
    {
    }

    /**
     * Sets value for custom property
     * @param value Value to be set for this component
     */
    public setValue(value: any)
    {
        this.form.patchValue(value || {}, {emitEvent: false});
    }
}