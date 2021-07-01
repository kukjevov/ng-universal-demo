/**
 * Interface for paging
 */
export interface Pageable
{
    /**
     * Number of items that should be returned
     */
    size: number;

    /**
     * Number of page that should be returned
     */
    page: number;
}