import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {slideInOutTrigger} from "@anglr/animations";
import {ComponentRoute} from "@anglr/common/router";
import {AuthGuard, Authorize} from "@anglr/authentication";
import {GlobalNotificationsService} from "@anglr/notifications";
import {Subscription} from "rxjs";
import * as moment from 'moment';

import {HodnotenieService, MetadataService, HodnotenieDetail, MosiaSprava, HodnotenieMetadata, HodnotenieMetadataDescription} from "../../../services/api/hodnotenie";
import {HodnotenieDataResolver, HodnotenieStateChanging} from "./hodnotenieData.resolver";
import {VSETCI, VSETKY} from "../../../misc/constants";
import {SummaryData, HodnotenieState, OknoState} from "./hodnotenie.interface";

export interface SummaryTexts
{
    [blok: string]:
    {
        prvy: string;
        prvyTooltip: string;
        druhy: string;
        druhyTooltip: string;
    };
}

const SUMMARY_TEXTS: SummaryTexts =
{
    "pacienti":
    {
        prvy: 'počet ošet. URČ:',
        prvyTooltip: 'Počet unikátnych ošetrených poistencov (unikátnych rodných čísel)',
        druhy: 'počet ošet. URČ v ref:',
        druhyTooltip: 'Priemerný počet unikátnych ošetrených poistencov (unikátnych rodných čísel) v referencii'
    },
    "kapPacienti":
    {
        prvy: 'počet kap. URČ:',
        prvyTooltip: 'Počet unikátnych kapitovaných poistencov (unikátnych rodných čísel)',
        druhy: 'počet kap. URČ v ref:',
        druhyTooltip: 'Priemerný počet unikátnych kapitovaných poistencov (unikátnych rodných čísel) v referencii'
    },
    "pripady":
    {
        prvy: 'počet DRG prípadov:',
        prvyTooltip: 'Počet DRG hospitalizačných prípadov',
        druhy: 'počet DRG prípadov v ref:',
        druhyTooltip: 'Priemerný počet DRG hospitalizačných prípadov v referencii'
    }
};

/**
 * Page with detail of 'hodnotenie'
 */
@Component(
{
    selector: 'hodnotenie-view',
    templateUrl: 'hodnotenie.component.html',
    styleUrls: ['hodnotenie.component.scss'],
    animations: [slideInOutTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'hodnotenie/:id', canActivate: [AuthGuard], resolve: {data: HodnotenieDataResolver}})
@Authorize("mosiaDetailHodnotenia-page")
export class HodnotenieComponent implements OnInit, OnDestroy
{
    //######################### private fields #########################

    /**
     * Indication that is specific 'lekar'
     */
    private _isSpecificLekar: boolean = false;

    /**
     * Subscription for changes of params
     */
    private _paramsSubscription: Subscription;

    /**
     * Subscription for changes of data
     */
    private _dataSubscription: Subscription;

    /**
     * Code of 'lekar'
     */
    private _lekarKod: string;

    /**
     * Code of 'PZS'
     */
    private _pzsKod: string;

    //######################### public properties - template binding #########################

    /**
     * Data for summary table
     */
    public summaryData: SummaryData[] = [];

    /**
     * Contains texts used for displaying first indicator in summary
     */
    public summaryTexts: SummaryTexts = SUMMARY_TEXTS;

    /**
     * Indication that is specific 'pracovisko'
     */
    public isSpecificPracovisko: boolean = false;

    /**
     * Indication whether dialog for adding note is visible
     */
    public addNoteDialogVisible: boolean;

    /**
     * Hodnotenie metadata description
     */
    public metadata: HodnotenieMetadata;

    /**
     * Array of 'okno' that are visible
     */
    public oknaVisible: HodnotenieMetadataDescription[] = [];

    /**
     * Hodnotenie detail data
     */
    public data: HodnotenieDetail;

    /**
     * Id without 'obdobie'
     */
    public id: string;

    /**
     * Id for accessing 'hodnoteniePZS' without 'obdobie'
     */
    public idPzs: string;

    /**
     * Identification of 'obdobie'
     */
    public obdobie: string;

    /**
     * Control for obdobie
     */
    public obdobieControl: FormControl;

    /**
     * Array of available 'obdobie' for current id
     */
    public obdobia: string[] = [];

    /**
     * Open window request id
     */
    public openWindowId: string = "";

    /**
     * Array of displayed messages
     */
    public spravy: MosiaSprava[] = [];

    /**
     * Object storing filter for jubula
     */
    public spravyFilter: FormGroup;

    /**
     * Object storing data for new note
     */
    public newSprava: FormGroup;

    //######################### constructor #########################
    constructor(private _hodnotenieSvc: HodnotenieService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _changeDetector: ChangeDetectorRef,
                private _metaSvc: MetadataService,
                private _notifications: GlobalNotificationsService,
                private _formBuilder: FormBuilder,
                private _hodnotenieStateChanging: HodnotenieStateChanging)
    {
        this.spravyFilter = this._formBuilder.group(
        {
            aktualne: true
        });

        this.newSprava = this._formBuilder.group(
        {
            text: "",
            aktualne: true
        });

        this.spravyFilter.valueChanges.subscribe(this._applyFilter.bind(this));

        this.obdobieControl = this._formBuilder.control(null);
        this.obdobieControl.valueChanges.subscribe(async obdobie =>
        {
            this.obdobie = obdobie;
            this.changeId(`${this.id}-${obdobie}`);
            this._changeDetector.detectChanges();
        });
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public async ngOnInit()
    {
        this.metadata = await this._metaSvc.metadata;

        this._paramsSubscription = this._route.params.subscribe(async params =>
        {
            if(this._hodnotenieStateChanging.changing)
            {
                return;
            }

            let id: string = params['id'];
            this.id = id.replace(/^(.*)-.*?$/, "$1");
            this.idPzs = this.id.replace(/^(.*?-.*?)-.*?-(.*)$/, `$1-${VSETCI}-$2`);
            this.obdobie = id.replace(/^.*-(.*?)$/, "$1");
            let lekarPracovisko = this.id.replace(/^.*?-.*?-(.*?-.*?)$/, "$1").split('-');
            this._isSpecificLekar = lekarPracovisko[0] != VSETCI;
            this.isSpecificPracovisko = lekarPracovisko[1] != VSETKY;
            this._lekarKod = lekarPracovisko[0];
            this._pzsKod = lekarPracovisko[1];
            this.obdobia = await this._hodnotenieSvc.getObdobia(this.id).toPromise();
            this.obdobieControl.setValue(this.obdobie, {emitEvent: false});
        });

        this._dataSubscription = this._route.data.subscribe(data =>
        {
            if(this._hodnotenieStateChanging.changing)
            {
                return;
            }

            this._loadData(data['data']);
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._paramsSubscription)
        {
            this._paramsSubscription.unsubscribe();
            this._paramsSubscription = null;
        }

        if(this._dataSubscription)
        {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }
    }

    //######################### public methods #########################

    /**
     * Loads data with changing of id
     * @param {string} id Changed id
     */
    public async changeId(id: string)
    {
        this._router.navigate(['..', id],
        {
            relativeTo: this._route,
            replaceUrl: true
        });
    }

    /**
     * Adds note to array of notes
     */
    public async addNote()
    {
        let value = this.newSprava.value;

        if(!value.text)
        {
            this._notifications.clearMessages();
            this._notifications.warning("Nie je možné pridať poznámku bez textu.");

            return;
        }

        let result = await this._hodnotenieSvc
            .createNote(this.id, value.text, value.aktualne ? this.obdobie : null)
            .toPromise();

        this.addNoteDialogVisible = false;
        this.data.spravy.push(result);
        this._applyFilter(this.spravyFilter.value);

        this.clearValue();

        this._changeDetector.detectChanges();
    }

    /**
     * Clears new note form
     */
    public clearValue()
    {
        this.newSprava.setValue(
        {
            text: "",
            aktualne: true
        });
    }

    /**
     * Removes 'sprava' from array of 'spravy'
     */
    public async removeNote(note: MosiaSprava)
    {
        await this._hodnotenieSvc
            .deleteNote(this.id, note.id)
            .toPromise();

        this.data.spravy.splice(this.data.spravy.indexOf(note), 1);
        this._applyFilter(this.spravyFilter.value);

        this._changeDetector.detectChanges();
    }

    /**
     * Displays overview of 'produkty'
     * @param nalepka Nalepka that should be displayed
     */
    public showProdukty(nalepka: string)
    {
        let obdobie = HodnotenieComponent.transformObdobie(this.obdobie);

        let filter: any =
        {
            datumOd: obdobie.od,
            datumDo: obdobie.do,
            stav: ["AKCEPTOVANE"],
            produktKod: [],
            produktSkupina: [],
            produktTyp: [],
            dg: [],
            idPoistenec: null,
            hlavny:
            {
                idPzs: this.isSpecificPracovisko ? <any>{kod: this._pzsKod} : null,
                lekarOsoba: this._isSpecificLekar ? <any>{kod: this._lekarKod} : null,
                nalepka: [nalepka],
                pracoviskoOdbornost: this.data.odbornost ? [<any>{kod: this.data.odbornost}] : [],
                typZS: this.data.typZsKod ? [this.data.typZsKod] : [],
                typPoskytnutia:
                [
                    'POSKYTUJUCI',
                    'INDIKUJUCI',
                    'ODPORUCAJUCI'
                ]
            },
            indikujuci:
            {
                idPzs: null,
                lekarOsoba: null,
                nalepka: null,
                pracoviskoOdbornost: null,
                typPoskytnutia: null,
                typZS: null
            },
            odporucajuci:
            {
                idPzs: null,
                lekarOsoba: null,
                nalepka: null,
                pracoviskoOdbornost: null,
                typPoskytnutia: null,
                typZS: null
            },
            poskytujuci:
            {
                idPzs: null,
                lekarOsoba: null,
                nalepka: null,
                pracoviskoOdbornost: null,
                typPoskytnutia: null,
                typZS: null
            },
            oznacene: null,
            mnozstvoOd: null,
            mnozstvoDo: null,
            udalostTyp: null,
            povod: ["ZPIS"],
            uzpOd: null,
            uzpDo: null,
            najvacsiaVaha: []
        };

        this._router.navigate(["../../produkty/prehlad", {filter: btoa(encodeURIComponent(JSON.stringify(filter)))}],
        {
            relativeTo: this._route
        });
    }

    /**
     * Displays overview of 'produkty'
     * @param nalepka Nalepka that should be displayed
     */
    public showHospitalizacie(nalepka: string)
    {
        let obdobie = HodnotenieComponent.transformObdobie(this.obdobie);
        let defaultFilter: any = {};

        defaultFilter.od = obdobie.od;
        defaultFilter.do = obdobie.do;
        defaultFilter.nalepka = [nalepka];
        defaultFilter.nemocnica = {kod: `${'pre'} ${this.data.idPzs}`, popis: `${'pre'} ${this.data.idPzs}`, kodServer: `${this.data.idPzs}*`};
        defaultFilter.pracoviskoOdbornost = this.data.odbornost && this.data.odbornost != 'ALL' ? [<any>{kod: this.data.odbornost}] : [];

        this._router.navigate(["/jubula/prehladHospitalizacii", {filter: btoa(encodeURIComponent(JSON.stringify(defaultFilter)))}],
        {
            relativeTo: this._route
        });
    }

    /**
     * Transforms string obdobie to moment dates
     * @param obdobie Obdobie to be transformed
     */
    public static transformObdobie(obdobie: string)
    {
        //moment(this.obdobie.toString(), "YYYYMM")
        //moment(this.obdobie.toString(), "YYYYMM").add(1, 'month').subtract(1, 'minute')
        let from: moment.Moment;
        let to: moment.Moment;

        //whole year
        if(obdobie.length == 4)
        {
            from = moment(obdobie, "YYYY");
            to = moment(obdobie, "YYYY").add(1, 'year').subtract(1, 'minute');
        }
        else
        {
            //month obdobie
            if(/^\d{6}$/.test(obdobie))
            {
                from = moment(obdobie, "YYYYMM");
                to = moment(obdobie, "YYYYMM").add(1, 'month').subtract(1, 'minute');
            }
            else
            {
                let matches = /^(\d{4})([P|Q]\d)/i.exec(obdobie);

                if(!matches)
                {
                    throw new Error('Neznámy formát obdobia');
                }

                let year = matches[1];
                let part = matches[2].toUpperCase();

                switch(part)
                {
                    case 'Q1':
                    {
                        from = moment(`${year}01`, "YYYYMM");
                        to = moment(`${year}03`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                    case 'Q2':
                    {
                        from = moment(`${year}04`, "YYYYMM");
                        to = moment(`${year}06`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                    case 'Q3':
                    {
                        from = moment(`${year}07`, "YYYYMM");
                        to = moment(`${year}09`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                    case 'Q4':
                    {
                        from = moment(`${year}10`, "YYYYMM");
                        to = moment(`${year}12`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                    case 'P1':
                    {
                        from = moment(`${year}01`, "YYYYMM");
                        to = moment(`${year}06`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                    case 'P2':
                    {
                        from = moment(`${year}07`, "YYYYMM");
                        to = moment(`${year}12`, "YYYYMM").add(1, 'month').subtract(1, 'minute');

                        break;
                    }
                }
            }
        }

        return {
            od: from,
            do: to
        };
    }

    /**
     * Updates hodnotenie state
     */
    public async updateHodnotenieState(oknoState: OknoState)
    {
        this._hodnotenieStateChanging.changing = true;

        try
        {
            let state: HodnotenieState = JSON.parse(decodeURIComponent(atob(this._route.snapshot.params['state'])));

            let nazov = oknoState.nazov;
            delete oknoState.nazov;

            state[nazov] = oknoState;

            await this._router.navigate(['.', {state: btoa(encodeURIComponent(JSON.stringify(state)))}],
                                        {
                                            relativeTo: this._route,
                                            replaceUrl: true
                                        });
        }
        catch(e)
        {
            console.log(e);
        }

        this._hodnotenieStateChanging.changing = false;
    }

    //######################### private methods #########################

    /**
     * Loads summary data
     */
    private _loadSummaryData()
    {
        let i1s = this.metadata.lavaStrana[this.data.typZS]['SUMAR-I1'].metas;
        let i2s = this.metadata.lavaStrana[this.data.typZS]['SUMAR-I2'].metas;

        this.summaryData = [];

        if(i1s && i2s)
        {
            i1s.forEach((i1, index) =>
            {
                let i2 = i2s[index];

                this.summaryData.push(new SummaryData(i1, i2, this.data.atributy));
            });
        }
    }

    /**
     * Applies filter to array of notes
     * @param {{aktualne: boolean}} filter Filter object
     */
    private _applyFilter(filter: {aktualne: boolean})
    {
        this.spravy = [];

        if(!this.data.spravy)
        {
            return;
        }

        if(filter.aktualne)
        {
            this.spravy = this.data.spravy.filter(itm => !itm.obdobie || itm.obdobie == this.obdobie);
        }
        else
        {
            this.spravy = this.data.spravy;
        }
    }

    /**
     * Loads data for current id and 'obdobie'
     */
    private async _loadData(data: HodnotenieDetail)
    {
        this.data = data;
        this.oknaVisible = this.metadata.pravaStrana.filter(okno => !!this.data.atributy[okno.nalepkamosia]);

        if(!this._route.snapshot.params['state'])
        {
            this._hodnotenieStateChanging.changing = true;

            let state: HodnotenieState = {};

            if(this.oknaVisible[0])
            {
                state[this.oknaVisible[0].nazov] =
                {
                    chart: true,
                    detail: true
                };
            }

            if(this.oknaVisible[1])
            {
                state[this.oknaVisible[1].nazov] =
                {
                    detail: true,
                    chart: false
                };
            }

            await this._router.navigate(['.', {state: btoa(encodeURIComponent(JSON.stringify(state)))}],
                                        {
                                            relativeTo: this._route,
                                            replaceUrl: true
                                        });

            this._hodnotenieStateChanging.changing = false;
        }

        this._applyFilter(this.spravyFilter.value);

        if(this._isSpecificLekar && this.data.poskytovatelia)
        {
            let summary = this.data.poskytovatelia.find(itm => itm.sumarny);
            let rest = this.data.poskytovatelia.filter(itm => !itm.sumarny);

            if(summary)
            {
                summary.nazov = "Lekár celkovo (všetky pracoviská)";
                summary.indent = false;
            }

            rest.forEach(itm =>
            {
                itm.indent = true;
            });

            this.data.poskytovatelia.splice(this.data.poskytovatelia.indexOf(summary), 1);
            this.data.poskytovatelia.unshift(summary);
        }

        if(this.isSpecificPracovisko && this.data.lekari)
        {
            let summary = this.data.lekari.find(itm => itm.sumarny);
            let rest = this.data.lekari.filter(itm => !itm.sumarny);

            if(summary)
            {
                summary.nazov = "Pracovisko celkovo (všetci lekári)";
                summary.indent = false;
            }

            rest.forEach(itm =>
            {
                itm.indent = true;
            });

            this.data.lekari.splice(this.data.lekari.indexOf(summary), 1);
            this.data.lekari.unshift(summary);
        }

        this._loadSummaryData();
        this._changeDetector.detectChanges();
    }
}