import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonModule as NgCommonModule} from '@ng/common';

import {NgSelectValuePipe} from '../pipes/ngSelectValue.pipe';
import {NgSelectControlValueAccessor} from '../misc/ngSelectControlValueAccessor.directive';
import {BasicNormalStateComponent} from '../plugins/normalState';
import {NoTextsLocatorComponent} from '../plugins/textsLocator';
import {BasicLiveSearchComponent, NoLiveSearchComponent} from '../plugins/liveSearch';
import {BasicPopupComponent} from '../plugins/popup';
import {BasicPositionerComponent} from '../plugins/positioner';
import {BasicKeyboardHandlerComponent} from '../plugins/keyboardHandler';
import {BasicValueHandlerComponent} from '../plugins/valueHandler';
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
        NoLiveSearchComponent,
        BasicLiveSearchComponent,
        BasicPopupComponent,
        BasicPositionerComponent,
        BasicKeyboardHandlerComponent,
        BasicValueHandlerComponent
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
        NoLiveSearchComponent,
        BasicLiveSearchComponent,
        BasicPopupComponent,
        BasicPositionerComponent,
        BasicKeyboardHandlerComponent,
        BasicValueHandlerComponent
    ]
})
export class NgSelectModule
{
}