/**
 * Representation of data that are paged
 */
export interface PagedData<TData>
{
    /**
     * Reveived data
     */
    content: TData[];

    /**
     * Count of all available pages
     */
    totalPages: number;

    /**
     * Count of all items that are available
     */
    totalElements: number;

    /**
     * Indication that this page is last or not
     */
    last: boolean;

    /**
     * Requested number of items
     */
    size: number;

    /**
     * Requested page number
     */
    number: number;

    /**
     * Indication whether is this first page
     */
    first: boolean;

    /**
     * Number of returned items
     */
    numberOfElements: number;
}