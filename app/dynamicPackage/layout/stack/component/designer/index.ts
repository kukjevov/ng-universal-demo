import {noop} from '@ng/common';

import {DynamicModule, NgModuleFactoryPromise} from "../../../../../ngDynamic-core";
import {StackDesignerModule} from './module';
import {StackDesignerComponent} from './component';

declare var isAot: boolean;

const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);

export const placeholderModule: DynamicModule =
{
    component: StackDesignerComponent,
    module: StackDesignerModule,
    moduleFactory: moduleFactory
};

export * from './metadata';