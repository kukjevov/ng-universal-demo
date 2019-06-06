/**
 * Description of action to be called
 */
export interface ActionDescription
{
    /**
     * Component id used for obtaining component instance
     */
    componentId: string;

    /**
     * Name of action (method) to be invoked
     */
    actionName: string;

    /**
     * Optional paramameter passed to action (method)
     */
    value?: any;
}