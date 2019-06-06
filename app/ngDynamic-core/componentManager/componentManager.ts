import {ComponentRelationManager} from "../componentRelationManager";
import {DynamicComponent} from "../interfaces";

/**
 * Manager used for handling instances of components
 */
export class ComponentManager
{
    //######################### private fields #########################

    /**
     * Registered components
     */
    private _components: {[id: string]: DynamicComponent} = {};

    //######################### constructor #########################
    constructor(private _relationManager: ComponentRelationManager)
    {
    }

    //######################### public methods #########################

    /**
     * Registers newly created component
     * @param id Id of component to be registered
     * @param component Component metadata with instance of component
     */
    public registerComponent(id: string, component: DynamicComponent)
    {
        if(this._components[id])
        {
            throw new Error(`Component with id '${id}' has duplicate, provide unique id.`);
        }

        this._components[id] = component;
        this._relationManager.updateRelations(id, component);
    }

    /**
     * Unregisters component and destroys all relations
     * @param id Id of component to be unregistered
     */
    public unregisterComponent(id: string)
    {
        if(!this._components[id])
        {
            throw new Error(`Component '${id}' is not registered.`)
        }

        this._relationManager.destroyComponent(id);
        delete this._components[id];
    }

    /**
     * Gets component instance or null
     * @param id Unique identification of component
     */
    public get(id: string): DynamicComponent
    {
        return this._components[id];
    }

    /**
     * Destroys all components registered in manager
     */
    public destroy()
    {
        Object.keys(this._components).forEach(id =>
        {
            this.unregisterComponent(id);
        });
    }
}