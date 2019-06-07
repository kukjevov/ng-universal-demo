import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class ProvideClass
{
    public value: string = "default";
}

export class Test
{
    public value: string = "provided";
}