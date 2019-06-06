import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

import {DesignerLayoutPlaceholderComponent} from "../../interfaces";

/**
 * Service storing all existing compoents and notifying when components change
 */
@Injectable()
export class ComponentsService
{
    //######################### private fields #########################

    /**
     * Currently all registered components
     */
    private _components: DesignerLayoutPlaceholderComponent[] = [];

    /**
     * Subject used for emitting changes in components array
     */
    private _componentsChange: Subject<void> = new Subject<void>();

    //######################### public properties #########################

    /**
     * Returns all registered components
     */
    public get components(): DesignerLayoutPlaceholderComponent[]
    {
        return this._components;
    }

    /**
     * Occurs when components array changes
     */
    public get componentsChange(): Observable<void>
    {
        return this._componentsChange.asObservable();
    }

    //######################### public methods #########################

    /**
     * Adds component to this service
     * @param component Component to be added
     */
    public addComponent(component: DesignerLayoutPlaceholderComponent)
    {
        this._components.push(component);
        this._componentsChange.next();
    }

    /**
     * Removes component from this service
     * @param component Component to be removed
     */
    public removeComponent(component: DesignerLayoutPlaceholderComponent)
    {
        if(!component)
        {
            return;
        }

        let index = this._components.indexOf(component);

        if(index >= 0)
        {
            this._components.splice(index, 1);
            this._componentsChange.next();            
        }
    }
}