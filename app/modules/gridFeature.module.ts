import {NgModule} from '@angular/core';
import {GridModule} from '@anglr/grid';

/**
 * Common module for enabling usage of Grid
 */
@NgModule(
{
    exports:
    [
        GridModule
    ]
})
export class GridFeatureModule
{
}