import {NgModule} from "@angular/core";

import {TooltipComponent} from '../components';
import {TooltipDirective} from '../directives';

/**
 * Module for rendering tooltips
 */
@NgModule(
{
    declarations:
    [
        TooltipDirective,
        TooltipComponent
    ],
    exports:
    [
        TooltipDirective,
        TooltipComponent
    ]
})
export class TooltipModule
{
}
