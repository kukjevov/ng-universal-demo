/**
 * Chart item tooltip
 */
export interface ChartItemTooltip
{
    /**
     * Value which should be displayed
     */
    value: ChartItem;

    /**
     * X coordinate for displaying tooltip
     */
    x: number;

    /**
     * Y coordinate for displaying tooltip
     */
    y: number;

    /**
     * Indication that it should be visible
     */
    visible: boolean;
}

/**
 * Represents item for chart
 */
export interface ChartItem
{
    /**
     * Date representing single day
     */
    date: string;

    /**
     * Number of cases
     */
    cases: number;
}