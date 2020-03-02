import {Component, ChangeDetectionStrategy} from "@angular/core";
import {ComponentRoute} from "@anglr/common/router";
import {AuthGuard, Authorize} from "@anglr/authentication";

/**
 * Sample page component
 */
@Component(
{
    selector: 'sample-page-view',
    templateUrl: 'samplePage.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Authorize('samplePage-page')
@ComponentRoute({path: '', canActivate: [AuthGuard]})
export class SamplePageComponent
{
}