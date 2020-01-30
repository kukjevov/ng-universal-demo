import {Component, ChangeDetectionStrategy, Input, HostBinding, EventEmitter, Output} from "@angular/core";
import {isPresent} from "@jscrpt/common";

import {HodnotenieLavaStranaMetadata, MosiaUtvarDetailPzs} from "../../../../services/api/hodnotenie";

/**
 * Component used for rendering one line in overview
 */
@Component(
{
    selector: 'overview-line',
    templateUrl: 'overviewLine.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewLineComponent
{
    //######################### private fields #########################

    /**
     * Indication whether is collapsed
     */
    private _collapsed: boolean;

    //######################### public properties - template bindings #########################

    /**
     * Indication whether is this collapsible
     */
    public collapsible: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Data that are displayed
     */
    @Input()
    public data?: MosiaUtvarDetailPzs;

    /**
     * Data for indicator 1
     */
    @Input()
    public dataI1?: HodnotenieLavaStranaMetadata;

    /**
     * Data for indicator 2
     */
    @Input()
    public dataI2?: HodnotenieLavaStranaMetadata;

    /**
     * Information that description should be indented
     */
    @Input()
    public indent?: boolean = false;

    /**
     * Information that description should be displayed as anchor
     */
    @Input()
    public href?: boolean;

    /**
     * Indication whether display collapsed children, null or undefined means no collapsible
     */
    @Input()
    public set collapsed(value: boolean)
    {
        this._collapsed = value;
        this.collapsible = isPresent(this._collapsed);
    }
    public get collapsed(): boolean
    {
        return this._collapsed;
    }

    /**
     * Indication that line is summary
     */
    @Input()
    @HostBinding('class.spolu')
    public spolu?: boolean = false;

    //######################### public properties - outputs #########################

    /**
     * Occurs when id was selected
     */
    @Output()
    public idSelect: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Occurs when collapsed changes
     */
    @Output()
    public collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}