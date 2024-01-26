import {Injectable, ViewContainerRef} from '@angular/core';

import {Metadata} from '../interfaces/metadata.interface';

export interface AllMeta
{
    viewContainer: ViewContainerRef;

    metadata: Metadata;
}

@Injectable()
export class Renderer
{
    public all: AllMeta[] = [];

    public registerComponent(viewContainer: ViewContainerRef, metadata: Metadata): void
    {
        this.all.push(
        {
            viewContainer,
            metadata,
        });
    }

    public swap(): void
    {
        const from = Math.round(Math.random() * (this.all.length - 1));
        const to = Math.round(Math.random() * (this.all.length - 1));

        console.log('swapping view containers', from, to);

        if(from == to)
        {
            return;
        }

        const toView = this.all[from].viewContainer.detach(0);
        const fromView = this.all[to].viewContainer.detach(0);

        if(toView && fromView)
        {
            this.all[to].viewContainer.insert(toView);
            this.all[from].viewContainer.insert(fromView);
        }
    }
}