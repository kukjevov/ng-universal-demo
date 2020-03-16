/**
 * Reprezentuje jednu polozku do grafu
 */
export interface ChartItem
{
    /**
     * Datum reprezentujuci jeden den
     */
    date: string;

    /**
     * Pocet pripadov
     */
    cases: number;
}