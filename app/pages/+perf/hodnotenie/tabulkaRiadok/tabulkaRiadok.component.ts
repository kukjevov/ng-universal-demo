import {Component, ChangeDetectionStrategy, Input, Inject, EventEmitter, Output} from "@angular/core";
import {DOCUMENT} from "@angular/common";

import {HodnotenieMetadataDescription, ChartKeyAttr} from "../../../../services/api/hodnotenie";

/**
 * Component used for rendering 'tabulka riadok'
 */
@Component(
{
    selector: 'tabulka-riadok-view',
    templateUrl: 'tabulkaRiadok.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabulkaRiadokComponent
{
    //######################### public properties - inputs #########################

    /**
     * Data that should be rendered inside 'tabulka'
     */
    @Input()
    public data: {[attribute: string]: any};

    /**
     * Metadata for 'tabulka'
     */
    @Input()
    public metadata: HodnotenieMetadataDescription;

    /**
     * Indication that rendered item is subitem
     */
    @Input()
    public subitem: boolean = false;

    /**
     * Indication whether currenctly displayed row is statistics row
     */
    @Input()
    public isStatistics: boolean = false;

    /**
     * Type of 'ZS'
     */
    @Input()
    public typZs: string;

    /**
     * Indication whether is tabulka used inside mosia PZS
     */
    @Input()
    public isMosiaPzs: boolean = false;

    //######################### public properties - outputs #########################

    /**
     * Emits indication that new chart data should be loaded
     */
    @Output()
    public chartIdSelected: EventEmitter<ChartKeyAttr> = new EventEmitter<ChartKeyAttr>();

    /**
     * Emits indication that open that is navigated to should be opened
     */
    @Output()
    public openWindow: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Emits indication that produkty should be displayed with requested 'nalepka'
     */
    @Output()
    public showProdukty: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Emits indication that 'hospitalizacie' should be displayed with requested 'nalepka'
     */
    @Output()
    public showHospitalizacie: EventEmitter<string> = new EventEmitter<string>();

    //######################### constructor #########################
    constructor(@Inject(DOCUMENT) private _document: HTMLDocument)
    {
    }

    //######################### public methods #########################
    
    /**
     * Go to related table
     */
    public goToTable()
    {
        this.openWindow.emit(this.metadata.odkaz);
        this._document.getElementById(this.metadata.odkaz).scrollIntoView({behavior: "smooth"});
    }

    /**
     * Loads chart if for current col is loadable
     * @param metadata Metadata for current row
     * @param attr Name of col
     */
    public loadChart(attr: string)
    {
        if(!this.metadata.containsAttr(attr))
        {
            return;
        }

        this.chartIdSelected.emit(
        {
            attr: attr,
            key: this.metadata.nazov
        });
    }
}