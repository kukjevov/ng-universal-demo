declare const isProduction: boolean;
declare const isNgsw: boolean;

interface ImportMeta
{
    webpackHot?: boolean;
}

declare module 'xhr2'
{
    const anything: any;

    export = anything;
}