import {Component, ChangeDetectionStrategy, Input, OnInit, OnChanges, OnDestroy, DoCheck, SimpleChanges, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';

@Component(
{
    selector: 'test-cmp',
    templateUrl: 'test.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestSAComponent implements OnInit, OnChanges, OnDestroy, DoCheck
{
    @Input()
    public id: string|undefined|null;

    @Input()
    public data: number|undefined|null;

    @Input()
    public randomStr: string|undefined|null;

    @ViewChild('element')
    public element: ElementRef<HTMLDivElement>|undefined|null;

    //######################### constructor #########################
    constructor(private _changeDetector: ChangeDetectorRef,)
    {
        console.log('test element ctor', this.element);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        console.log('test init', this.id);
        console.log('test element init', this.element);
    }

    //######################### public methods - implementation of DoCheck #########################
    
    /**
     * Called when component is checked for changes
     */
    public ngDoCheck(): void
    {
        console.log('test check', this.id);
        console.log('test element check', this.element);
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        console.log('test changes', this.id, changes);
        console.log('test element changes', this.element);
    }

    //######################### public methods - implementation of AfterViewInit #########################
    
    /**
     * Called when view was initialized
     */
    public ngAfterViewInit(): void
    {
        console.log('test element after view init', this.element);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        console.log('test destroy', this.id);
    }

    /**
     * @inheritdoc
     */
    public invalidateVisuals(): void
    {
        console.log('test element invalidate before', this.element);
        this._changeDetector.detectChanges();
        console.log('test element invalidate after', this.element);
    }

}