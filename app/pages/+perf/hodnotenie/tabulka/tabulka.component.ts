import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {slideInOutTrigger} from '@anglr/animations';
import {nameof} from "@jscrpt/common";

import {HodnotenieMetadataDescription, ChartKeyAttr} from "../../../../services/api/hodnotenie";

/**
 * Component used for rendering 'tabulka'
 */
@Component(
{
    selector: 'tabulka-view',
    templateUrl: 'tabulka.component.html',
    animations: [slideInOutTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabulkaComponent implements OnChanges
{
    //######################### public properties - inputs #########################

    /**
     * Data that should be rendered inside 'tabulka'
     */
    @Input()
    public data: {[uroven2: string]: any};

    /**
     * Metadata for 'tabulka'
     */
    @Input()
    public metadata: HodnotenieMetadataDescription;

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

    //######################### constructors #########################
    constructor(private _route: ActivatedRoute)
    {
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<TabulkaComponent>('metadata') in changes && changes[nameof<TabulkaComponent>('metadata')].currentValue)
        {
            let query = this._route.snapshot.queryParamMap;

            if(query.has('showAll'))
            {
                if(this.metadata.children && this.metadata.children.length)
                {
                    this.metadata.children.forEach(uroven1 =>
                    {
                        uroven1.collapsed = false;
                    });
                }
            }
        }
    }

    //######################### public methods #########################

    /**
     * Loads chart if for current col is loadable
     * @param metadata Metadata for current row
     * @param attr Name of col
     */
    public loadChart(keyAttr: ChartKeyAttr)
    {
        keyAttr.key = `${this.metadata.nazov}_${keyAttr.key}`;

        this.chartIdSelected.emit(keyAttr);
    }
}