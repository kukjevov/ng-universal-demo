import {NgModule} from '@angular/core';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DebugDataModule} from '@anglr/common';

/**
 * Common module for allowing debugging features in code
 */
@NgModule(
{
    exports:
    [
        ClipboardModule,
        DebugDataModule
    ]
})
export class DebuggingFeatureModule
{
}