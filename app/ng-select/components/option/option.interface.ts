/**
 * Option for ng select
 */
export interface NgSelectOption<TValue>
{
    /**
     * Value that will be used if this option will be selected
     */
    value?: TValue;

    /**
     * Text that is displayed if this value is selected
     */
    text?: string;

    /**
     * If specified this option will be displayed in group
     */
    group?: string;
}