import {MosiaUtvarDetail, HodnotenieIndikator, HodnotenieLavaStranaMetadata} from "../../../services/api/hodnotenie";

export interface OknoState
{
    detail?: boolean;
    chart?: boolean;
    nazov?: string;
}

export interface HodnotenieState
{
    [nazov: string]: OknoState;
}

export class SummaryData implements MosiaUtvarDetail
{
    //######################### public properties #########################

    public uuid?: string;
    public nazov?: string;
    public aktualny?: boolean;
    public sumarny?: boolean;
    public lekari?: MosiaUtvarDetail[];
    public indikator1?: HodnotenieIndikator;
    public indikator2?: HodnotenieIndikator;

    constructor(public i1: HodnotenieLavaStranaMetadata, public i2: HodnotenieLavaStranaMetadata, atributy: {})
    {
        this.nazov = i1.popis;

        let i1Nalepka = atributy[i1.nalepkaMosia];
        let i2Nalepka = atributy[i2.nalepkaMosia];

        if(i1Nalepka)
        {
            this.indikator1 =
            {
                urc: atributy[i1.nalepkaMosia][i1.indikator],
                urcRef: atributy[i1.nalepkaMosia][i1.indikator + 'Ref']
            };
        }

        if(i2Nalepka)
        {
            this.indikator2 =
            {
                urc: atributy[i2.nalepkaMosia][i2.indikator],
                urcRef: atributy[i2.nalepkaMosia][i2.indikator + 'Ref'],
                urcRefDiff: atributy[i2.nalepkaMosia][i2.indikator + 'RefDiff'],
                urcRefDiffVaha: atributy[i2.nalepkaMosia][i2.indikator + 'RefDiffVaha']
            };
        }
    }
}