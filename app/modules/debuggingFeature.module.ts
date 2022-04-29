import {NgModule} from '@angular/core';
import {DebugDataCopyClickModule} from '@anglr/common/material';

/**
 * Common module for allowing debugging features in code
 */
@NgModule(
{
    exports:
    [
        DebugDataCopyClickModule,
    ]
})
export class DebuggingFeatureModule
{
}