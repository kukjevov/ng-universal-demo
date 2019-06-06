import {Injectable, Type, Inject} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {generateId, Dictionary} from '@asseco/common';

/**
 * Class used for loading external scripts
 */
@Injectable({providedIn: 'root'})
export class ScriptLoader
{
    //######################### private fields #########################

    /**
     * Loaded types for scripts
     */
    private _loadedTypes: {[script: string]: Type<any>} = {};

    //######################### constructor #########################
    constructor(@Inject(DOCUMENT) private _document: HTMLDocument)
    {
    }

    //######################### public methods #########################

    /**
     * Loads type from script
     * @param script Script used for obtaining type
     * @param references Array of reference names
     */
    public loadType(script: string, references: string[]): Type<any>
    {
        if(this._loadedTypes[script])
        {
            return this._loadedTypes[script];
        }

        let resolvedReferences: Dictionary = {};

        resolvedReferences['moment'] = require('moment');

        let scriptElement = this._document.createElement("script");
        let loadTypeObjName = `loadType${generateId(12)}`;
        let type: Type<any>;

        scriptElement.innerText = `
        (function(exports, loadType, require)
        {
            ${script}

            loadType(exports);
        })({}, ${loadTypeObjName}.loadType, ${loadTypeObjName}.require);`;

        window[loadTypeObjName] = 
        {
            loadType: exp =>
            {
                type = exp[Object.keys(exp)[0]];
            },
            require: requireName => 
            {
                let result = resolvedReferences[requireName];

                if(!result)
                {
                    throw new Error(`Missing external reference type '${requireName}' registration!`);
                }

                return result;
            }
        };

        this._document.getElementsByTagName("head")[0].appendChild(scriptElement);
        delete window[loadTypeObjName];
        scriptElement.remove();

        this._loadedTypes[script] = type;

        return type;
    }
}