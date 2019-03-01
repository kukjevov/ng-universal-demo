import {NgModule} from '@angular/core';

import {DynamicValueHandlerComponent} from '../plugins/valueHandler';

/**
 * Module for select and its options, allows use of dynamic value handler
 */
@NgModule(
{
    declarations:
    [
        DynamicValueHandlerComponent
    ],
    entryComponents:
    [
        DynamicValueHandlerComponent
    ]
})
export class NgSelectDynamicModule
{
}