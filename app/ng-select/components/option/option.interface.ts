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

/**
 * Option for ng select
 */
export interface ɵNgSelectOption<TValue> extends NgSelectOption<TValue>
{
    /**
     * Indication whether is item active
     */
    active?: boolean;

    /**
     * Indication whether is this option selected
     */
    selected?: boolean;
}