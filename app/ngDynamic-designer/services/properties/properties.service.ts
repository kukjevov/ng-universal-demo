import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

import {PropertiesMetadata} from "../../interfaces";
import {NodePropertiesService} from "../../components";

/**
 * Properties service used for communication with properties window
 */
@Injectable()
export class PropertiesService implements NodePropertiesService
{
    //######################### private fields #########################

    /**
     * Subject for emitting when new properties should be loaded in properties component
     */
    private _loadPropertiesSubject: Subject<PropertiesMetadata> = new Subject<PropertiesMetadata>();

    //######################### public properties #########################

    /**
     * Occurs when new properties should be loaded into properties component
     */
    public get loadProperties(): Observable<PropertiesMetadata>
    {
        return this._loadPropertiesSubject.asObservable();
    }

    //######################### public methods #########################

    /**
     * Shows properties by metadata in properties component
     * @param PropertiesMetadata Metadata that should be loaded into properties component
     */
    public showProperties(PropertiesMetadata: PropertiesMetadata)
    {
        this._loadPropertiesSubject.next(PropertiesMetadata);
    }
}