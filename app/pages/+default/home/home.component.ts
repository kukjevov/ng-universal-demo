import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {generateId} from '@jscrpt/common';

import {RendererSADirective} from './misc/directives/renderer.directive';
import {Metadata} from './misc/interfaces/metadata.interface';
import {Renderer} from './misc/services/renderer.service';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    standalone: true,
    imports:
    [
        RendererSADirective,
    ],
    providers:
    [
        Renderer,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
    public metadata: Metadata[];

    constructor(private _changeDetector: ChangeDetectorRef,
                private _renderer: Renderer,)
    {
        this._changeDetector.detach();

        this.metadata = [];

        for(let x = 0; x < 5; x++)
        {
            this.metadata.push(
            {
                data: x,
                id: generateId(10),
                randomStr: generateId(15),
            });
        }
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this.detectChanges();
    }

    public add(): void
    {
        const meta = this.metadata;

        this.metadata.push(
        {
            data: Math.random()*100,
            id: generateId(10),
            randomStr: generateId(15),
        });

        console.log('meta changed', meta !== this.metadata);

        this.detectChanges();
    }

    public remove(): void
    {
        this.metadata.splice(Math.round(Math.random() * (this.metadata.length - 1)), 1);

        this.detectChanges();
    }

    public swap(): void
    {
        // const from = Math.round(Math.random() * (this.metadata.length - 1));
        // const to = Math.round(Math.random() * (this.metadata.length - 1));

        // console.log('swapping', from, to);

        this._renderer.swap();

        // const swapped =this.metadata.splice(from, 1);

        // this.metadata.splice(to, 0, ...swapped);

        // this.detectChanges();
    }

    public detach(): void
    {
        console.log('detach before');
        this._changeDetector.detach();
        console.log('detach after');
    }
    
    public reattach(): void
    {
        console.log('reattach before');
        this._changeDetector.reattach();
        console.log('reattach after');
    }

    public detectChanges(): void
    {
        console.log('detect changes before');
        this._changeDetector.detectChanges();
        console.log('detect changes after');
    }
    
    public markForCheck(): void
    {
        console.log('mark for check before');
        this._changeDetector.markForCheck();
        console.log('mark for check after');
    }
}
