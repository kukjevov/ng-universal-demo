import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {IDisposable, languages} from "monaco-editor";

import {CodeMetadata, TypescriptAdditionalData} from "../../interfaces";
import {TypingsLoader} from "../../typingsLoader";

/**
 * Service used for communication with "Monaco" code editor
 */
@Injectable()
export class CodeService
{
    //######################### private fields #########################

    /**
     * Array of disposables
     */
    private _disposables: IDisposable[] = [];

    /**
     * Subject used for emitting code metadata change
     */
    private _codeChangeSubject: Subject<CodeMetadata> = new Subject<CodeMetadata>();

    /**
     * Method used for obtaining compiled result of code
     */
    private _getCompiled: (metadata: CodeMetadata) => Promise<string>;

    //######################### public properties #########################

    /**
     * Occurs when code metadata changes
     */
    public get codeChange(): Observable<CodeMetadata>
    {
        return this._codeChangeSubject.asObservable();
    }

    //######################### constructor #########################
    constructor(private _typingsLoader: TypingsLoader)
    {
    }    

    //######################### public methods #########################

    /**
     * Registers get compiled function
     * @param getCompiledFn Get compiled function that is being registered
     */
    public ɵRegisterGetCompiled(getCompiledFn: (metadata: CodeMetadata) => Promise<string>)
    {
        this._getCompiled = getCompiledFn;
    }

    /**
     * Shows code from metadata in editor
     */
    public showCode(metadata: CodeMetadata)
    {
        this.destroy();

        this._processAdditionalData(metadata);
        this._codeChangeSubject.next(metadata);
    }

    /**
     * Gets compiled result for metadata
     * @param metadata Metadata which compiled result will be obtained
     */
    public getCompiled(metadata: CodeMetadata): Promise<string>
    {
        if(this._getCompiled)
        {
            return this._getCompiled(metadata);
        }

        return Promise.resolve('');
    }

    /**
     * Destroys code
     */
    public destroy()
    {
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
    }

    //######################### private methods #########################

    /**
     * Process additional data
     * @param metadata Metadata containing additional data to be processed
     */
    private _processAdditionalData(metadata: CodeMetadata)
    {
        if(metadata.language == 'typescript' && metadata.additionalData)
        {
            let additionalData: TypescriptAdditionalData = metadata.additionalData;

            //load provided typings
            if(additionalData.typings && additionalData.typings.length)
            {
                additionalData.typings.forEach((typings, index) =>
                {
                    this._disposables.push(languages.typescript.typescriptDefaults.addExtraLib(typings, `file:///node_modules/@types/${metadata.name}${index}/index.d.ts`));
                });
            }

            //load reference typings
            if(additionalData.references && additionalData.references.length)
            {
                additionalData.references.forEach(reference =>
                {
                    this._disposables.push(languages.typescript.typescriptDefaults.addExtraLib(this._typingsLoader.getTypings(reference), `file:///node_modules/@types/${reference}/index.d.ts`));
                });
            }

            // if(metadata.additionalData && Array.isArray(metadata.additionalData))
            // {
            //     metadata.additionalData.forEach(data =>
            //     {
            //         switch(data)
            //         {
            //             case 'node-transform':
            //             {
                            

            //                 break;
            //             }
            //         }
            //     });
            // }
        }
    }
}