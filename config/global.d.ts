// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@anglr/common/typings/structured-log/index.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@anglr/common/typings/positions/index.d.ts" />

declare let isProduction: boolean;

interface ImportMeta
{
    webpackHot?: boolean;
}

declare module 'structured-log'
{
    export = StructuredLog;
}

declare module 'positions'
{
    export = Positions;
}

declare module 'xhr2'
{
    const anything: any;

    export = anything;
}