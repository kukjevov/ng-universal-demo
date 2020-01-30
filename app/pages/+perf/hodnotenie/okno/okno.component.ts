import {Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {slideInOutTrigger} from '@anglr/animations';
import {isPresent} from "@jscrpt/common";

import {HodnotenieMetadataDescription, ChartKeyAttr, ChartRequest} from "../../../../services/api/hodnotenie";
import {HodnotenieState, OknoState} from "../hodnotenie.interface";

/**
 * Component used for rendering 'okno'
 */
@Component(
{
    selector: 'okno-view',
    templateUrl: 'okno.component.html',
    animations: [slideInOutTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OknoComponent implements OnInit, OnChanges
{
    //######################### public properties - template bindings #########################

    /**
     * Request that is used for chart
     */
    public chartRequest: {request: ChartRequest, id: string};

    /**
     * Title displayed for chart
     */
    public chartTitle: string;

    /**
     * Indication that this table display statistics
     */
    public isStatistics: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Data that should be rendered inside 'okno'
     */
    @Input()
    public data: {[tabulka: string]: any};

    /**
     * Metadata for 'okno'
     */
    @Input()
    public metadata: HodnotenieMetadataDescription;

    /**
     * Indication that detail should be visible
     */
    @Input()
    public detailVisible: boolean = false;

    /**
     * Indication that chart should be visible
     */
    @Input()
    public chartVisible: boolean = false;

    /**
     * Currently selected 'odbobie'
     */
    @Input()
    public obdobie: string;

    /**
     * Current id without 'obdobie'
     */
    @Input()
    public id: string;

    /**
     * Type of 'ZS'
     */
    @Input()
    public typZs: string;

    /**
     * Sets open window id
     */
    @Input()
    public set openWindowId(value: string)
    {
        if(this.metadata && this.metadata.nazov == value)
        {
            this.detailVisible = true;
        }
    }

    //######################### public properties - outputs #########################

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

    /**
     * Emits indication that okno state has changed
     */
    @Output()
    public oknoStateChange: EventEmitter<OknoState> = new EventEmitter<OknoState>();

    //######################### private properties #########################

    /**
     * Gets default chart request
     */
    private get defaultChartRequest(): {request: ChartRequest, id: string}
    {

        return {
            id: this.id,
            request:
            {
                atribut: this.metadata.grafDefault || 'nakladyUrc',
                obdobie: this.obdobie,
                klucRiadku: this.metadata.grafDefaultKluc
            }
        };
    }

    //######################### constructor #########################
    constructor(private _route: ActivatedRoute)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.chartRequest = this.defaultChartRequest;

        try
        {
            let state: HodnotenieState = JSON.parse(decodeURIComponent(atob(this._route.snapshot.params['state'])));
            let oknoState = state[this.metadata.nazov];

            if(oknoState)
            {
                this.chartVisible = oknoState.chart;
                this.detailVisible = oknoState.detail;
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when at least one of inputs has changed
     * @param changes Changes that will were detected
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if('data' in changes)
        {
            if(this.metadata)
            {
                this.isStatistics = this.metadata.nalepkamosia.indexOf('STAT-') == 0;
            }

            this.chartRequest = this.defaultChartRequest;

            this.metadata.children.forEach(table =>
            {
                table.hasChildren = false;

                if(isPresent(table.nalepkamosia) && isPresent(this.data[table.nalepkamosia]))
                {
                    table.hasChildren = true;
                }
                else
                {
                    for(let x = 0; x < table.children.length; x++)
                    {
                        if(isPresent(this.data[table.children[x].nalepkamosia]))
                        {
                            table.hasChildren = true;

                            break;
                        }
                    }
                }
            });
        }
    }

    //######################### public methods #########################

    /**
     * Loads chart into view
     * @param keyAttr Key attr identification
     */
    public loadChart(keyAttr: ChartKeyAttr)
    {
        keyAttr.key = `${this.metadata.nazov}_${keyAttr.key}`;

        this.chartRequest =
        {
            id: this.id,
            request:
            {
                atribut: keyAttr.attr,
                obdobie: this.obdobie,
                klucRiadku: keyAttr.key
            }
        };

        this.chartVisible = true;
    }
}