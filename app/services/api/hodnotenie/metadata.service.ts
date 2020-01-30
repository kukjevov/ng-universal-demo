import {Injectable} from "@angular/core";

import {HodnotenieService} from "./hodnotenie.service";
import {HodnotenieMetadataDescription, HodnoteniePravaStranaMetadata, HodnotenieMetadata, HodnotenieLavaStranaMetadata, HodnotenieSummaryMetadataDescription} from "./hodnotenie.interface";

/**
 * Service used for obtaining metadata
 */
@Injectable()
export class MetadataService
{
    //######################### private fields #########################

    /**
     * Metadata hodnotenie promise
     */
    private _metadataPromise: Promise<HodnotenieMetadata>;

    /**
     * Metadata 'hodnotenie' promise for 'pzs'
     */
    private _metadataPzsPromise: Promise<HodnotenieMetadata>;

    //######################### public properties #########################

    /**
     * Gets metadata for 'hodnotenie' promise
     */
    public get metadata(): Promise<HodnotenieMetadata>
    {
        return this._metadataPromise;
    }

    /**
     * Gets metadata for 'hodnotenie' promise for 'pzs'
     */
    public get metadataPzs(): Promise<HodnotenieMetadata>
    {
        return this._metadataPzsPromise;
    }

    //######################### constructor #########################
    constructor(hodnSvc: HodnotenieService)
    {
        this._metadataPromise = new Promise(async resolve =>
        {
            let meta = await hodnSvc.getMetadata()
                .toPromise();

            let prava = this._processMetadata(meta.pravaStrana);
            let lava = this._processSummaryMetadata(meta.lavaStrana);

            resolve(
            {
                lavaStrana: lava,
                pravaStrana: prava
            });
        });

        this._metadataPzsPromise = new Promise(async resolve =>
        {
            let meta = await hodnSvc.getMetadataPzs()
                .toPromise();

            let result = this._processMetadata(meta.pravaStrana);
            let lava = this._processSummaryMetadata(meta.lavaStrana);

            let grafMeta = {};

            if(meta && meta.graf && meta.graf.length)
            {
                meta.graf.forEach(graf =>
                {
                    graf.typZS.forEach(typZs =>
                    {
                        grafMeta[typZs] = graf;
                    });
                });
            }

            resolve(
            {
                lavaStrana: lava,
                pravaStrana: result,
                graf: grafMeta
            });
        });
    }

    //######################### private fields #########################

    /**
     * Process summary metadata to easier format to handle by code
     * @param metadata Metadata to be processed
     */
    private _processSummaryMetadata(metadata: HodnotenieLavaStranaMetadata[]): HodnotenieSummaryMetadataDescription
    {
        let result: HodnotenieSummaryMetadataDescription = {};

        metadata.forEach(meta =>
        {
            if(meta.typZS && Array.isArray(meta.typZS))
            {
                meta.typZS.forEach(typZs =>
                {
                    if(!result[typZs])
                    {
                        result[typZs] = {};
                    }
                    
                    if(!result[typZs][meta.typIndikatora])
                    {
                        result[typZs][meta.typIndikatora] = {};
                    }

                    //SUMARs are array
                    if(meta.typIndikatora.startsWith('SUMAR-I'))
                    {
                        if(!result[typZs][meta.typIndikatora].metas)
                        {
                            result[typZs][meta.typIndikatora].metas = [];
                        }

                        result[typZs][meta.typIndikatora].metas.push(meta);
                    }
                    else
                    {
                        result[typZs][meta.typIndikatora].meta = meta;
                    }
                });
            }
        });

        return result;
    }

    /**
     * Process metadata to easier format to handle by code
     * @param metadata Metadata to be processed
     */
    private _processMetadata(metadata: HodnoteniePravaStranaMetadata[])
    {
        let result = [];
        let lastWin = null;
        let lastTab = null;
        let lastLvl = null;
        let tmpWin: HodnotenieMetadataDescription = null;
        let tmpTab: HodnotenieMetadataDescription = null;
        let tmpLvl: HodnotenieMetadataDescription = null;

        metadata.forEach(itm =>
        {
            //okno
            if(!itm.uroven2 && !itm.uroven1 && !itm.tabulka)
            {
                if(lastWin != itm.okno)
                {
                    tmpWin =
                    {
                        children: [],
                        id: itm.id,
                        nazov: itm.okno,
                        odkaz: itm.odkaz,
                        popis: itm.popis,
                        collapsed: true,
                        nalepkamosia: itm.nalepkamosia,
                        oknoAtribut: itm.oknoAtribut,
                        oknoAtributFormat: itm.oknoAtributFormat
                    };

                    lastWin = itm.okno;
                    lastTab = null;
                    lastLvl = null;

                    result.push(tmpWin);
                }
            }
            //tabulka
            else if(!itm.uroven1 && !itm.uroven2)
            {
                if(lastTab != itm.tabulka)
                {
                    tmpTab =
                    {
                        children: [],
                        id: itm.id,
                        nazov: itm.tabulka,
                        odkaz: itm.odkaz,
                        popis: itm.popis,
                        tabulkaCasti: itm.tabulkaCasti || [],
                        collapsed: true,
                        nalepkamosia: itm.nalepkamosia
                    };

                    lastTab = itm.tabulka;

                    tmpWin.children.push(tmpTab);
                }
            }
            //uroven1
            else if(!itm.uroven2)
            {
                if(lastLvl != itm.uroven1)
                {
                    tmpLvl =
                    {
                        children: [],
                        id: itm.id,
                        nazov: itm.uroven1,
                        odkaz: itm.odkaz,
                        popis: itm.popis,
                        tabulkaCasti: tmpTab.tabulkaCasti,
                        collapsed: true,
                        nalepkamosia: itm.nalepkamosia,
                        graf: itm.graf,
                        containsAttr: function(this: HodnotenieMetadataDescription, attr: string)
                        {
                            if(!this.graf)
                            {
                                return false;
                            }

                            return this.graf.indexOf(attr) > -1;
                        }
                    };

                    if(itm.oknoGraf)
                    {
                        tmpWin.grafDefaultKluc = `${lastWin}_${lastTab}_${itm.uroven1}`;
                        tmpWin.grafDefault = itm.oknoGraf;
                    }

                    lastLvl = itm.uroven1;

                    tmpTab.children.push(tmpLvl);
                }
            }
            //uroven2
            else
            {
                tmpLvl.children.push(
                {
                    children: null,
                    id: itm.id,
                    nazov: itm.uroven2,
                    odkaz: itm.odkaz,
                    popis: itm.popis,
                    tabulkaCasti: tmpTab.tabulkaCasti,
                    collapsed: true,
                    nalepkamosia: itm.nalepkamosia,
                    containsAttr: () => false
                });
            }
        });

        return result;
    }
}