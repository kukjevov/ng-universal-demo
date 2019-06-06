import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {FormBuilder, FormControl} from "@angular/forms";
import {StringDictionary} from "@asseco/common";
import {Subscription, Observable} from "rxjs";

import {DynamicComponentGeneric, DynamicOutput} from "../../../../ngDynamic-core";
import {Data} from "../../../../services/api/data/data.interface";

/**
 * Simple component
 */
@Component(
{
    selector: 'simple-component',
    templateUrl: 'simple.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleComponent implements DynamicComponentGeneric<string>
{
    //######################### private fields #########################

    /**
     * Subscription for changes in output control
     */
    private _outputChangeSubscription: Subscription;

    //######################### public properties - inputs #########################

    /**
     * Simple input property
     */
    public simpleInput: string;

    /**
     * Observable input
     */
    public set observableInput(result: Observable<Data>)
    {
        result.subscribe(result =>
        {
            this.result = result;

            this._changeDetector.detectChanges();
        });
    }

    /**
     * Query string
     */
    public query: StringDictionary = {};

    //######################### public properties - outputs #########################

    /**
     * Simple output property
     */
    @DynamicOutput()
    public simpleOutput: string = 'default';

    /**
     * Condtion that is changed by button
     */
    @DynamicOutput()
    public condition: boolean = true;

    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: string = 'default';

    //######################### public properties - template bindings #########################

    /**
     * Output bound to control
     */
    public outputControl: FormControl;

    /**
     * Result data to be displayed
     */
    public result: Data;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef,
                formBuilder: FormBuilder)
    {
        this.outputControl = formBuilder.control(null);

        this._outputChangeSubscription = this.outputControl.valueChanges.subscribe((val) =>
        {
            this.simpleOutput = val;
        });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._outputChangeSubscription)
        {
            this._outputChangeSubscription.unsubscribe();
            this._outputChangeSubscription = null;
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
     * Shows alert with message
     * @param value Value passed to this method
     */
    public testAction(value?: any)
    {
        alert(`test action called on '${this.options}' with value '${value}'`);
    }
}