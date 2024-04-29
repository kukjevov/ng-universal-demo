declare const isProduction: boolean;

interface ImportMeta
{
    webpackHot?: boolean;
}

declare module 'xhr2'
{
    const anything: any;

    export = anything;
}