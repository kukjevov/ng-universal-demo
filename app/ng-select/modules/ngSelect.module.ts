import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonModule as NgCommonModule} from '@ng/common';

import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {NgSelectControlValueAccessor} from '../misc/ngSelectControlValueAccessor.directive';
import {BasicNormalStateComponent} from '../plugins/normalState';
import {NoTextsLocatorComponent} from '../plugins/textsLocator';
import {BasicLiveSearchComponent} from '../plugins/liveSearch';
import {BasicPopupComponent} from '../plugins/popup';
import {OptGroupComponent, OptionComponent} from '../components/option';
import {NgSelectComponent} from '../components/select';

/**
 * Module for select and its options
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgCommonModule
    ],
    declarations:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor,
        BasicNormalStateComponent,
        NoTextsLocatorComponent,
        BasicLiveSearchComponent,
        BasicPopupComponent
    ],
    exports:
    [
        OptionComponent,
        OptGroupComponent,
        NgSelectComponent,
        NgSelectValuePipe,
        NgSelectControlValueAccessor
    ],
    entryComponents:
    [
        BasicNormalStateComponent,
        NoTextsLocatorComponent,
        BasicLiveSearchComponent,
        BasicPopupComponent
    ]
})
export class NgSelectModule
{
}