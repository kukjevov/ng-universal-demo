/**
 * Transform script interface for transformation of any data to any data
 */
export interface TransformScript
{
    /**
     * Method that transforms value into any requested value
     * @param value Value to be transformed
     */
    transform(value: any): any;
}