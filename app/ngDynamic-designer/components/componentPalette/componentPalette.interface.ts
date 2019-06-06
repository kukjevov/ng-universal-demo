import {DesignerLayoutMetadata} from "../../interfaces";

/**
 * Description of package passed to component palette component
 */
export interface ComponentPalettePackage
{
    /**
     * Package name
     */
    packageName: string,

    /**
     * List of components in package
     */
    components: ComponentPalettePackageComponent[]
}

/**
 * Description of component passed to component palette component
 */
export interface ComponentPalettePackageComponent
{
    /**
     * Component name
     */
    componentName: string,

    /**
     * Metadata for dynamic component designer
     */
    designerMetadata: DesignerLayoutMetadata
}