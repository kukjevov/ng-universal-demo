import {Directive, Input, SimpleChanges, OnInit, OnChanges} from "@angular/core";
import {NgSelectComponent, NgSelectOption, CodeOptionsGatherer} from "@anglr/select";
import {isBlank, ValueNamePair, nameof, isString} from "@jscrpt/common";
import {reinitializeOptions} from "@anglr/select/extensions";

import {KodPopisValue} from "../../../../misc/types";
import {EnumService} from "../../../../services/api/enum/enum.service";
import {NOTHING_SELECTED} from "../../../../misc/constants";

/**
 * Extended KodPopisValue
 */
interface KodPopisNa extends KodPopisValue
{
    vazbaNa: string[];
}

/**
 * Directive used for obtaining and creating enumeration of values
 */
@Directive(
{
    selector: 'ng-select[enumNameZs]',
    providers: [EnumService]
})
export class EnumNameZsDirective implements OnInit, OnChanges
{
    //######################### private fields #########################

    /**
     * Obtained all data
     */
    private _allData: KodPopisNa[] = [];

    /**
     * Enum options gatherer instance
     */
    private _codeOptionsGatherer: CodeOptionsGatherer<string> = new CodeOptionsGatherer<string>();

    //######################### public properties - input #########################

    /**
     * Name of enum which values will be filled into select
     */
    @Input()
    public enumNameZs: string;

    /**
     * Currently selected 'typ ZS'
     */
    @Input()
    public typZs: string;

    /**
     * If this is not empty, empty value with this text will be added
     */
    @Input()
    public emptyValueText: string|boolean;

    /**
     * Transform mapping function for item
     */
    @Input()
    public mappingCallback: (item: any) => ValueNamePair;

    //######################### constructor #########################
    constructor(private _enums: EnumService,
                private _select: NgSelectComponent<string>)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(isBlank(this.enumNameZs))
        {
            throw new Error("No name was provided for enumNameZs directive!");
        }

        this._select.execute(reinitializeOptions(
        {
            optionsGatherer: this._codeOptionsGatherer
        }));

        let enumsObservable = this._enums.getEnumObj(this.enumNameZs);

        enumsObservable
            .subscribe(result =>
            {
                Object.keys(result).forEach(key =>
                {
                    this._allData.push(
                    {
                        kod: key,
                        popis: result[key].popis,
                        vazbaNa: result[key].vazbaNa
                    });
                });

                this._setData();
            });
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<EnumNameZsDirective>('typZs') in changes && this.typZs && !changes[nameof<EnumNameZsDirective>('typZs')].firstChange)
        {
            this._setData();
        }
    }

    //######################### private methods #########################

    /**
     * Filters data based on typZS
     */
    private _setData()
    {
        let tmp: ValueNamePair[];
        let allData = this._allData;

        if(this.typZs)
        {
            allData = allData.filter(itm => !!itm.vazbaNa.find(itm => itm == this.typZs));
        }

        if(this.mappingCallback)
        {
            tmp = allData.map(this.mappingCallback);
        }
        else
        {
            tmp = allData.map(itm => { return {value: itm.kod, name: itm.popis}; });
        }

        if(this.emptyValueText)
        {
            tmp =
            [
                {
                    value: '',
                    name: isString(this.emptyValueText) ? this.emptyValueText : NOTHING_SELECTED
                },
                ...tmp
            ];
        }

        this._codeOptionsGatherer.options = tmp.map(itm =>
        {
            return <NgSelectOption<string>>
            {
                value: itm.value,
                text: itm.name
            };
        });

        this._codeOptionsGatherer.optionsChange.emit();
        this._codeOptionsGatherer.availableOptionsChange.emit();
    }
}