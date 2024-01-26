import {Directive, DoCheck, Injector, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';

import {Metadata} from '../interfaces/metadata.interface';
import {TestSAComponent} from '../components/test.component';
import {Renderer} from '../services/renderer.service';

@Directive(
{
    selector: '[renderer]',
    standalone: true,
})
export class RendererSADirective implements OnInit, OnChanges, OnDestroy, DoCheck
{
    @Input()
    public metadata: Metadata|undefined|null;

    constructor(private _viewContainer: ViewContainerRef,
                private _injector: Injector,
                private _renderer: Renderer,)
    {
        console.log('renderer same injector', this._viewContainer.injector == this._injector);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        console.log('renderer on init', this.metadata?.id);
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        console.log('renderer on changes', this.metadata?.id, changes);

        console.log('renderer clearing');
        this._viewContainer.clear();
        console.log('renderer cleared');
        console.log('renderer creating');
        const component = this._viewContainer.createComponent(TestSAComponent);

        if(this.metadata)
        {
            this._renderer.registerComponent(this._viewContainer, this.metadata);
        }
        
        component.changeDetectorRef.detach();
        console.log('renderer created');

        console.log('renderer same injector component', this._viewContainer.injector == component.injector, this._injector == component.injector);

        component.setInput('id', this.metadata?.id);
        component.setInput('data', this.metadata?.data);
        component.setInput('randomStr', this.metadata?.randomStr);

        console.log('renderer component detect changes before');
        component.instance.invalidateVisuals();
        console.log('renderer component detect changes after');
    }

    //######################### public methods - implementation of DoCheck #########################
    
    /**
     * Called when component is checked for changes
     */
    public ngDoCheck(): void
    {
        console.log('renderer do check', this.metadata?.id);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        console.log('renderer destroy', this.metadata?.id);
    }
}