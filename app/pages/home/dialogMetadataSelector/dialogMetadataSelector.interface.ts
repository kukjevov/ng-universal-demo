import {Type} from "@angular/core";
import {MetadataSelector, MetadataSelectorOptions, VisualPluginOptions} from "@ng/grid";

/**
 * Css classes for dialog metadata selector
 */
export interface CssClassesDialogMetadataSelector
{
    componentClass?: string;
    btnClass?: string;
    btnIconClass?: string;
    dialogComponentClasses?: Object;
}

/**
 * Texts that are used within DialogMetadataSelector
 */
export interface DialogMetadataSelectorTexts
{
    btnShowSelection?: string;
    dialogComponentTexts?: Object;
}

/**
 * Dialog metadata selector options
 */
export interface DialogMetadataSelectorOptions<TMetadata> extends MetadataSelectorOptions, VisualPluginOptions<CssClassesDialogMetadataSelector>
{
    /**
     * Texts that are used within DialogMetadataSelector
     */
    texts?: DialogMetadataSelectorTexts;

    /**
     * Indication whether is button for showing metadata selection visible
     */
    showButtonVisible?: boolean;

    /**
     * Name of cookie storing current metadata status
     */
    cookieName?: string;

    /**
     * Component that is used for handling metadata selection itself
     */
    dialogComponent?: Type<DialogMetadataSelectorComponent<TMetadata>>;
}

/**
 * Public API for 'DialogMetadataSelector'
 */
export interface DialogMetadataSelector<TMetadata> extends MetadataSelector<TMetadata>
{
}

/**
 * Data that are passed to component that handles metadata
 */
export interface DialogMetadataSelectorComponentData<TMetadata>
{
    /**
     * Method that is used for setting metadata into component
     */
    metadata: TMetadata;

    /**
     * Css classes passed to dialog component
     */
    cssClasses: Object;

    /**
     * Texts passed to dialog component
     */
    texts: Object;

    /**
     * Method that is used for sending metadata out of component to metadata selector
     * @param metadata Metadata that were changed in component passed back to selector
     */
    setMetadata(metadata: TMetadata);
}

/**
 * Component that is rendered within dialog
 */
export interface DialogMetadataSelectorComponent<TMetadata>
{
    /**
     * Data that are used for communication with MetadataSelector
     */
    data: DialogMetadataSelectorComponentData<TMetadata>;
}