import {Selection, BaseType, Line, line, curveBundle} from 'd3';
import {Subject, Observable, Subscription} from 'rxjs';

import {Coordinates, SvgRelationDynamicNode, SvgPeerDropArea} from '../../../../interfaces';
import {INVALIDATE_DROP} from '../../nodeDesigner.interface';

/**
 * Class that represents SVG relation and interaction with it
 */
export class SvgRelation implements SvgRelationDynamicNode
{
    //######################### private fields #########################

    /**
     * Subject used for emitting destroying event
     */
    private _destroyingSubject: Subject<SvgRelationDynamicNode> = new Subject<SvgRelationDynamicNode>();

    /**
     * Object that represents rendered path
     */
    private _path: Selection<SVGPathElement, {}, null, undefined>;

    /**
     * Line generator for generating lines
     */
    private _lineGenerator: Line<[number, number]>;

    //######################### public properties #########################

    /**
     * Occurs when this relations is being destroyed
     */
    public get destroying(): Observable<SvgRelationDynamicNode>
    {
        return this._destroyingSubject.asObservable();
    }

    /**
     * Subscription for start destroying of this relation
     */
    public startDestroyingSubscription: Subscription;

    /**
     * Subscription for end destroying of this relation
     */
    public endDestroyingSubscription: Subscription;

    /**
     * Information about connected peer at the end
     */
    public endPeer: SvgPeerDropArea;

    //######################### constructor #########################
    constructor(private _parentGroup: Selection<BaseType, {}, null, undefined>,
                public start: Coordinates,
                public end: Coordinates,
                private _getDropArea: () => SvgPeerDropArea)
    {
        this._path = this._parentGroup.append('path')
            .attr('fill', 'transparent')
            .attr('stroke', '#F8F8F8');

        this._lineGenerator = line()
            .curve(curveBundle.beta(0.75));
    }

    //######################### public methods #########################

    /**
     * Method used for destroying this relation node
     */
    public destroy()
    {
        this._path.remove();
        this._path = null;
        this._lineGenerator = null;

        this._destroyingSubject.next(this);

        if(this.startDestroyingSubscription)
        {
            this.startDestroyingSubscription.unsubscribe();
            this.startDestroyingSubscription = null;
        }

        if(this.endDestroyingSubscription)
        {
            this.endDestroyingSubscription.unsubscribe();
            this.endDestroyingSubscription = null;
        }

        this.endPeer = null;
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     * @param propertyName Name of property that has changed
     */
    public invalidateVisuals(propertyName?: string): void
    {
        if(propertyName == INVALIDATE_DROP)
        {
            let dropArea = this._getDropArea();

            //drop not on input peer
            if(!dropArea)
            {
                this.destroy();
                this.start = null;
                this.end = null;
            }
            //drop on input peer
            else
            {
                //can add input relation
                if(dropArea.svgNode.addInputRelation(this, dropArea.inputId, dropArea.dynamic))
                {
                    this.end = dropArea.svgNode.getInputCoordinates(dropArea.inputId, dropArea.dynamic);
                }
                else
                {
                    this.destroy();
                    this.start = null;
                    this.end = null;
                }
            }
        }

        if(!this.start || !this.end)
        {
            return;
        }

        let points;

        //path from right to left
        if(this.end.x <= this.start.x)
        {
            let width = this.start.x - this.end.x;
            let half = (this.end.y - this.start.y) / 2;
            
            if(width < 12)
            {
                width = 12;
            }

            width *= 1.3;

            points = 
            [
                [this.start.x, this.start.y],
                [this.start.x + width, this.start.y + half],
                [this.end.x - width, this.start.y + half],
                [this.end.x, this.end.y]
            ];
        }
        //path from left to right
        else
        {
            let width = this.end.x - this.start.x;
            let third = width / 3;

            points = 
            [
                [this.start.x, this.start.y],
                [this.start.x + third, this.start.y],
                [this.end.x - third, this.end.y],
                [this.end.x, this.end.y]
            ];
        }

        this._path.datum(points)
            .attr('d', this._lineGenerator);
    }
}