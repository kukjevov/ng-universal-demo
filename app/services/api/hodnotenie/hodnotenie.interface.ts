import * as moment from 'moment';

import {KodPopisValue} from "../../../misc/types";

export type MosiaFormat = "percento"|"celecislo"|"dvedesatiny";

export interface Lekar
{
    meno?: string;
    priezvisko?: string;
    menoPriezvisko?: string;
    kod?: string;
    id?: number;
    osoba?: string;
    kodOdbornosti?: string;
    nazovOdbornosti?: string;
}

export interface Sprava
{
    uuid?: string;
    cas?: moment.Moment;
    fkId?: string;
    fkObject?: string;
    id?: string;
    idPoistenec?: number;
    kod?: string;
    popis?: string;
    povod?: string;
    vaha?: string;
    vytvoril?: string;
    zavaznost?: string;
    sources?: any[];
    zaver?: boolean;
    sourcesString?: string; //INTERNAL
    infoString?: string; //INTERNAL
}

export interface HodnotenieIndikatorFilter
{
    urcRefDiffVahy?: string[];
    urcRefDiffDo?: number;
    urcRefDiffOd?: number;
    urcOd?: number;
    urcDo?: number;
}

export interface HodnotenieFilter
{
    typUtvaru?: string;
    obdobia?: string[];
    kraj?: string;
    okres?: string;
    typPzs?: string;
    typZS?: string;
    refSk?: Array<KodPopisValue>;
    idPzs?: KodPopisValue;
    idLekar?: KodPopisValue;
    pacientiOd?: number;
    pacientiDo?: number;
    pripadyOd?: number;
    pripadyDo?: number;
    indikatory?: {[id: number]: HodnotenieIndikatorFilter};
}

export interface Hodnotenie
{
    uuid?: string;
    typZS?: string;
    typUtvaru?: string;
    obdobie?: moment.Moment;
    refSk?: KodPopisValue;
    typPzs?: string;
    utvar?: string;
    indikatory?: HodnotaOhodnotenieRozdiel;
    uuidPzs?: string; // INTERNAL
    typUtvaruOrig?: string; // INTERNAL
}

export interface HodnotaOhodnotenieRozdiel
{
    urc?: number;
    urcRefDiff?: number;
    urcRefDiffVaha?: number;
    urcRef?: number;
}

export interface GrafMetadata
{
    typZS?: string[];
    klucRiadku?: string;
    indikator?: string;
}

export interface DetailMetadata
{
    lavaStrana?: HodnotenieLavaStranaMetadata[];
    pravaStrana?: HodnoteniePravaStranaMetadata[];
    graf?: GrafMetadata[];
}

export interface HodnotenieLavaStranaMetadata
{
    typIndikatora?: string;
    typZS?: string[];
    nalepkaMosia?: string;
    indikator?: string;
    format?: MosiaFormat;
    blok?: string;
    popis?: string;
    tooltip?: string;
}

export interface HodnoteniePravaStranaMetadata
{
    okno: string;
    tabulka: string;
    uroven1: string;
    uroven2: string;
    nalepkamosia?: string;
    popis: string;
    id: string;
    odkaz: string;
    graf?: string[];
    oknoGraf?: string;
    oknoAtribut?: string;
    oknoAtributFormat?: MosiaFormat;
    tabulkaCasti?: string[];
}

export interface HodnoteniePrehladMetadata
{
    id?: number;
    indikator?: string;
    popis?: string;
    skupina?: string;
    typZS?: string[];
    format?: string;
    selected?: boolean; //INTERNAL
}

export interface HodnotenieMetadata
{
    lavaStrana?: HodnotenieSummaryMetadataDescription;
    pravaStrana?: HodnotenieMetadataDescription[];
    graf?: {[typZs: string]: GrafMetadata};
}

export interface HodnotenieSummaryMetadataDescription
{
    [typZs: string]:
    {
        [typIndikatora: string]:
        {
            meta?: HodnotenieLavaStranaMetadata;
            metas?: HodnotenieLavaStranaMetadata[];
        };
    };
}

export interface HodnotenieMetadataDescription
{
    nazov: string;
    popis: string;
    id?: string;
    odkaz?: string;
    nalepkamosia?: string;
    collapsed?: boolean;
    children?: HodnotenieMetadataDescription[];
    graf?: string[];
    grafDefault?: string;
    grafDefaultKluc?: string; //INTERNAL
    oknoAtribut?: string;
    oknoAtributFormat?: MosiaFormat;
    tabulkaCasti?: string[];
    containsAttr?: (attr: string) => boolean; //INTERNAL
    hasChildren?: boolean; //INTERNAL
}

export interface Poskytovatel
{
    nazov?: string;
}

export interface MosiaSprava extends Sprava
{
    mosiautvarid4?: string;
    obdobie?: string;
}

export interface HodnotenieIndikator
{
    urc?: number;
    urcRefDiff?: number;
    urcRefDiffVaha?: string;
    urcRef?: number;
}

export interface Ambulancia
{
    indikator?: HodnotenieIndikator;
    nazov?: string;
    refSk?: string;
    uuid?: string;
}

export interface HlavnyUkazovatel
{
    nazov?: string;
    popis?: string;
    icon?: string;
    jednotka?: string;
    hodnota?: number;
    rozdiel?: number;
    vaha?: number;
    percentil?: number;
    referencia?: number;
    atribut?: string;
    klucRiadku?: string;
    hranice?:
    {
        hodnota?: number;
        kodFarby?: string;
        vaha?: string;
    }[];
}

export interface HodnotenieDetail
{
    lekar?: Lekar;
    poskytovatel?: Poskytovatel;
    atributy: {[nalepkamosia: string]: any};
    hlavneUkazovatele?: HlavnyUkazovatel[];
    poskytovatelia: MosiaUtvarDetail[];
    refSk?: KodPopisValue;
    idPzs?: string;
    typPzs?: string;
    lekari: MosiaUtvarDetail[];
    spravy?: MosiaSprava[];
    pocetUtvarov?: number;
    odbornost?: string;
    typZsKod?: string;
    typZS?: string;
    sumar?: {[key: string]: HodnotenieIndikator};
    uuid?: string;
}

export interface MosiaUtvarDetail
{
    uuid?: string;
    nazov?: string;
    aktualny?: boolean;
    sumarny?: boolean;
    lekari?: MosiaUtvarDetail[];
    indikator1?: HodnotenieIndikator;
    indikator2?: HodnotenieIndikator;
    href?: string; // INTERNAL
    indent?: boolean; // INTERNAL
    collapsed?: boolean; // INTERNAL
}

export interface MosiaUtvarDetailPzsGrouped
{
    typZs?: string;
    data?: MosiaUtvarDetailPzs[];
}

export interface MosiaUtvarDetailPzs extends MosiaUtvarDetail
{
    refSk?: string;
    typZs?: string;
}

export interface MosiaChartData
{
    stlpce?: MosiaChartValue[];
    obdobia?: string[];
    reference?: MosiaChartValue;
    legendaRiadokKluc?: string;
    legendaAtribut?: string;
}

export interface MosiaChartValue
{
    farba?: string;
    legendaKluc?: string;
    hodnoty?: number[];
    reference?: boolean; //INTERNAL
}

export interface ChartKeyAttr
{
    key?: string;
    attr?: string;
}

export interface ChartRequest
{
    klucRiadku: string;
    atribut: string;
    obdobie: string;
}