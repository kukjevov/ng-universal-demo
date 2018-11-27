import {DynamicModule, DynamicComponent, DynamicComponentMetadata, DynamicComponentMetadataGeneric} from "../../ngDynamic-core";
import {LayoutMetadata} from "./designer";
import {RelationsMetadata} from "./relations";

/**
 * Metadata used for designer of dynamic component
 */
export interface ComponentDesignerMetadata
{
    /**
     * Javascript module containing dynamic component module definition
     */
    placeholderModule?: DynamicModule;

    /**
     * Metadata for relations (node designer)
     */
    relationsMetadata?: RelationsMetadata;

    /**
     * Metadata for layout (layout designer)
     */
    layoutMetadata?: LayoutMetadata;
}

/**
 * Static description of 
 */
export interface DesignerDynamicComponentClass
{
    /**
     * Metadata used for designer
     */
    ɵMetadata: ComponentDesignerMetadata;
}

/**
 * Description of dynamic component for designer
 */
export interface DesignerDynamicComponent extends DynamicComponent
{
    /**
     * Layout metadata that will be used for rendering
     */
    readonly metadata: DynamicComponentMetadata;

    /**
     * Array of child components
     */
    readonly children: DesignerDynamicComponent[];

    /**
     * Sets metadata for designer component
     * @param metadata Metadata to be set for designer component
     */
    setMetadata(metadata: DynamicComponentMetadata);
}

/**
 * Description of dynamic component for designer
 */
export interface DesignerDynamicComponentGeneric<TOptions> extends DesignerDynamicComponent
{
    /**
     * Options used for rendering this component
     */
    options: LayoutMetadata;

    /**
     * Layout metadata that will be used for rendering
     */
    readonly metadata: DynamicComponentMetadataGeneric<TOptions>;
}

/**
 * Description of data passed to designer component renderer
 */
export interface DesignerComponentRendererData extends ComponentMetadata
{
    /**
     * Metadata for dynamic component designer
     */
    designerMetadata: ComponentDesignerMetadata;

    /**
     * Existing metadata for dynamic component (for rendering)
     */
    componentMetadata: DynamicComponentMetadata;
}

/**
 * Name of package and component to be displayed
 */
export interface ComponentMetadata
{
    /**
     * Name of package that contains this component
     */
    packageName: string;

    /**
     * Name of component to be rendered
     */
    componentName: string;
}

/**
 * Base metadata description for layout and node designer
 */
export interface DesignerMetadata
{
    /**
     * Unique id of component instance in dynamic page
     */
    id?: string;

    /**
     * Name that is displayed for user for better identification of component|node type
     */
    name?: string;

    /**
     * Description of component|node type, can be longer
     */
    description?: string;
}