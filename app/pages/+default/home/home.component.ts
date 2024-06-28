import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, ComponentRouteAuthorized} from '@anglr/authentication';
import {DebugDataCopyClickModule} from '@anglr/common/material';

const name = 'test';

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
        DebugDataCopyClickModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRouteAuthorized({path: 'home'})
@Authorize('home-page')
export class HomeComponent
{
    //######################### public methods - implementation of OnInit #########################
    
    /**
     * @inheritdoc
     */
    public async ngOnInit(): Promise<void>
    {
        const component = await import(`../${name}`);

        console.log(component);
    }
}
