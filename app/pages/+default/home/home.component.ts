import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';
import {Authorize, AuthGuard} from '@anglr/authentication';
import {provideLayoutRelations} from '@anglr/dynamic/layout-relations';
import {provideCssLayoutRelations} from '@anglr/dynamic/css-components';
import {provideTinyMceLayoutRelations} from '@anglr/dynamic/tinymce-components';
import {provideHandlebarsLayoutRelations} from '@anglr/dynamic/handlebars-components';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    providers:
    [
        provideLayoutRelations(),
        provideCssLayoutRelations(),
        provideTinyMceLayoutRelations(),
        provideHandlebarsLayoutRelations(),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home', canActivate: [AuthGuard]})
@Authorize('home-page')
export class HomeComponent
{
}
