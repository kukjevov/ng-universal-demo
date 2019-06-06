import {noop} from '@ng/common';

import {DynamicModule, NgModuleFactoryPromise} from "../../../../../ngDynamic-core";
import {ConditionalDesignerModule} from './module';
import {ConditionalDesignerComponent} from './component';

declare var isAot: boolean;

const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);

export const placeholderModule: DynamicModule =
{
    component: ConditionalDesignerComponent,
    module: ConditionalDesignerModule,
    moduleFactory: moduleFactory
};

export * from './metadata';