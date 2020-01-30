import {Pipe, PipeTransform} from "@angular/core";
import {GlobalizationService} from "@anglr/common";
import {NumeralPipe} from "@anglr/common/numeral";

import {MosiaFormat} from "../../../../../services/api/hodnotenie";

const FORMATS_MAP =
{
    "percento": "0%",
    "celecislo": "0,0",
    "jednadesatina": "0,0.0",
    "dvedesatiny": "0,0.00",
    "jednadesatina%": "0,0.0%",
    "dvedesatiny%": "0,0.00%",
    "celecisloE": "0,0",
    "jednadesatinaE": "0,0.0",
    "dvedesatinyE": "0,0.00"
};

/**
 * Applies mosia format to provided number
 */
@Pipe(
{
    name: "format"
})
export class MosiaFormatPipe implements PipeTransform
{
    //######################### private fields #########################

    /**
     * Instance of numeral pipe
     */
    private _numeral = new NumeralPipe(this._globalizationSvc);

    constructor(private _globalizationSvc: GlobalizationService)
    {
    }

    //######################### public methods #########################

    /**
     * Applies specific format to number from metadata
     * @param value Value to be formatted
     * @param format Format from metadata
     */
    public transform(value: number, format: MosiaFormat, opts?: {euro?: boolean; plus?: boolean;}): string
    {
        if(!format)
        {
            format = "celecislo";
        }

        if(!opts)
        {
            opts =
            {
                euro: false,
                plus: false
            };
        }

        if(format.endsWith('E'))
        {
            opts.euro = true;
        }

        return this._numeral.transform(value, (opts.plus ? '+' : '') + FORMATS_MAP[format]) + (opts.euro ? ' €' : '');
    }
}