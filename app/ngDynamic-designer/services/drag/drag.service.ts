import {Injectable} from "@angular/core";
import {Subject, Observable} from "rxjs";

//TODO not yet implemented!

@Injectable()
export class DragService
{
    //######################### private properties #########################

    /**
     * Subject used for emitting changes in components array
     */
    private _draggingChange: Subject<boolean> = new Subject<boolean>();

    /**
     * Indication whether dragging is active
     */
    private _isDragging: boolean = false;

    //######################### public properties #########################

    /**
     * Item that is actually dragged
     */
    public dragItem: any;

    //######################### public properties getters and setters #########################

    /**
     * Indication whether dragging is active
     */
    public get isDragging(): boolean
    {
        return this._isDragging;
    }

    /**
     * Occurs when components array changes
     */
    public get draggingChange(): Observable<boolean>
    {
        return this._draggingChange.asObservable();
    }

    //######################### public methods #########################

    /**
     * Handles dragStart event
     * @param dragItem 
     */
    public dragStart(dragItem: any)
    {
        this.dragItem = dragItem;
        this._isDragging = true;
        this._draggingChange.next(true);
    }

    /**
     * Handles dragEnd event
     */
    public dragEnd()
    {
        this._isDragging = false;
        this._draggingChange.next(false);
    }
}