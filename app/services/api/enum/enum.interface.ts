export const WT_CENY_PRIMARNA = 'PRIMARNA';
export type WtCenyPrimarna = 'PRIMARNA';
export type WtCeny = 'DOPRAVA'|'LIEK_ZP'|'SVLZ'|WtCenyPrimarna;

export interface EnumObj
{
    kratkyPopis?: string;
    popis?: string;
}

export interface PriznakPoistenec
{
    priznak?: string;
    popis?: string;
    farba?: string;
}