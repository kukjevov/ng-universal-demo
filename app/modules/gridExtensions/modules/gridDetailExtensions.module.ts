import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BasicDetailTableMetadataGathererComponent, AdvancedDetailTableBodyContentRendererComponent} from '../components';
import {ToBasicTableColumnSelectableContextPipe} from '../pipes';

/**
 * Module storing anglr grid detail extensions
 */
@NgModule(
{
    imports:
    [
        CommonModule
    ],
    declarations:
    [
        BasicDetailTableMetadataGathererComponent,
        AdvancedDetailTableBodyContentRendererComponent,
        ToBasicTableColumnSelectableContextPipe
    ],
    exports:
    [
        BasicDetailTableMetadataGathererComponent
    ]
})
export class GridDetailExtensionsModule
{
}