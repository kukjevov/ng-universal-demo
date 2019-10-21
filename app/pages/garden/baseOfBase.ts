import {ViewChild, Injectable} from "@angular/core";
import {TestWrapper} from "../../boot/test";

@Injectable()
export class BaseOfBase
{
    @ViewChild(TestWrapper)
    public child: TestWrapper;
}