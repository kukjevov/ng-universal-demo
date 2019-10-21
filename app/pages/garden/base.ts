import {Injectable, AfterViewInit} from "@angular/core";
import {BaseOfBase} from "./baseOfBase";

@Injectable()
export class Base extends BaseOfBase implements AfterViewInit
{
    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        console.log(this.child);
    }
}