import {Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {isPresent, isBlank} from "@jscrpt/common";

import {Sprava} from "../../services/api/hodnotenie/hodnotenie.interface";

/**
 * Component used for displaying vaha tag in Mosia
 */
@Component(
{
    selector: 'vaha-tag',
    templateUrl: 'vahaTag.component.html',
    styleUrls: ['vahaTag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VahaTagComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication whether X value should be allowed
     */
    private _allowX: boolean = false;

    /**
     * Indication whether was component destroyed
     */
    private _destroyed: boolean = false;

    //######################### public properties - template bindings #########################

    /**
     * Gets css class of current 'vaha' value
     */
    public get vahaCssClass(): string
    {
        switch(this.value.toString())
        {
            case "X":
            case "NEHODNOTENE":
            {
                return "weight-x";
            }
            case "-1":
            {
                return "weight-down";
            }
            case "0":
            {
                return "weight-0";
            }
            case "1":
            {
                return "weight-1";
            }
            case "2":
            {
                return "weight-2";
            }
            case "3":
            {
                return "weight-3";
            }
            case "4":
            {
                return "weight-4";
            }
            case "5":
            {
                return "weight-5";
            }
        }

        return "";
    }

    /**
     * Gets indication whether value is present
     */
    public get hasValue(): boolean
    {
        return isPresent(this.value) && 
               (this.value !== "0" || this.allowZero) &&
               (this.value !== "X" || this._allowX);
    }

    //######################### public properties - inputs #########################
    
    /**
     * Value of 'vaha'
     */
    @Input()
    public value: string;

    /**
     * Default value that is displayed if no value was found
     */
    @Input()
    public defaultValue: string;

    /**
     * Indication that zeroes are allowed
     */
    @Input()
    public allowZero: boolean = false;

    /**
     * Allows to init value using 'spravy'
     */
    @Input()
    public set spravy(value: Sprava[])
    {
        if(value && value.length)
        {
            value.forEach(itm =>
            {
                if(itm.vaha == "X")
                {
                    return;
                }

                if(isBlank(this.value))
                {
                    this.value = itm.vaha;

                    return;
                }

                if(parseInt(this.value) < parseInt(itm.vaha))
                {
                    this.value = itm.vaha;
                }
            });
        }
        else if(isPresent(this.defaultValue))
        {
            this.value = this.defaultValue;
        }
    }

    //######################### constructors #########################
    constructor(private _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        let isDeveloper = true;

        if(isDeveloper && !this._destroyed)
        {
            this._allowX = true;

            this._changeDetector.detectChanges();
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._destroyed = true;
    }
}