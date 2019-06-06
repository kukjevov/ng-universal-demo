import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {isBlank, isPresent} from "@asseco/common";

import {DynamicComponentGeneric, DynamicOutput} from "../../../../ngDynamic-core";
import {ButtonComponentOptions} from "./button.interface";
import {ActionDescription} from "../../../../nodeDefinitions";

/**
 * Component used for displaying button
 */
@Component(
{
    selector: 'button-component',
    templateUrl: 'button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements DynamicComponentGeneric<ButtonComponentOptions>
{
    //######################### public properties #########################

    /**
     * Options used for rendering this component
     */
    public options: ButtonComponentOptions;

    /**
     * Value that can be set for button, which is then passed to calling method
     */
    public value?: any|any[];

    /**
     * Trigger value, this is describes actions that will be called
     */
    @DynamicOutput()
    public trigger: ActionDescription[] = [];

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles button click
     */
    public handleClick()
    {
        if(isPresent(this.value))
        {
            this.trigger.forEach((trigger, index) =>
            {
                if(Array.isArray(this.value))
                {
                    trigger.value = this.value[index];
                }
                else
                {
                    trigger.value = this.value;
                }
            });
        }

        this.trigger = this.trigger;
    }

    //######################### public methods #########################

    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     */
    public invalidateVisuals(propertyName?: string): void
    {
        if(isBlank(propertyName))
        {
            this.trigger = this.options.actions || [];

            this._changeDetector.detectChanges();
        }
    }
}