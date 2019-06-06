import {DesignerServiceMetadata} from "../metadata.interface";

/**
 * Constant represents name of invalidation for code changes
 */
export const INVALIDATE_CODE: string = 'code';

/**
 * Metadata used for displaying code editor
 */
export interface CodeMetadata extends DesignerServiceMetadata
{
    /**
     * Code template that is loaded into code editor
     */
    template?: string;

    /**
     * Language displayed in code editor
     */
    language?: 'typescript'|'handlebars';

    /**
     * Additional data
     */
    additionalData?: TypescriptAdditionalData|HandlebarsAdditionalData;
}

/**
 * Additional data for typescript
 */
export interface TypescriptAdditionalData
{
    /**
     * Array of typings that should be loaded
     */
    typings?: string[];

    /**
     * Array of external references names for which typings should be loaded
     */
    references?: string[];
}

/**
 * Additional data for handlebars
 */
export interface HandlebarsAdditionalData
{
}