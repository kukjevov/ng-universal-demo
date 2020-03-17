import {Pipe, PipeTransform} from "@angular/core";

/**
 * Subtracts value 
 */
@Pipe({name: "subtract"})
export class SubtractPipe implements PipeTransform
{
    //######################### public methods #########################

    /**
     * Subtracts value
     * @param value - Value that is going to be subtracted
     * @param subtract - Subtracted value
     */
    public transform(value: number, subtract: number): number
    {
        return value - subtract;
    }
}