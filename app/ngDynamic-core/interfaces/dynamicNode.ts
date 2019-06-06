/**
 * Each type of dynamic node should implement this
 */
export interface DynamicNode
{
    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     * @param initial Indication whether is invalidation initial, or on event
     */
    invalidateVisuals(propertyName?: string, initial?: boolean): void;
}