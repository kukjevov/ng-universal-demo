import {noop} from '@ng/common';

import {DynamicModule, NgModuleFactoryPromise} from "../../../../../ngDynamic-core";
import {BlockDesignerModule} from './module';
import {BlockDesignerComponent} from './component';

declare var isAot: boolean;

const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);

export const placeholderModule: DynamicModule =
{
    component: BlockDesignerComponent,
    module: BlockDesignerModule,
    moduleFactory: moduleFactory
};

export * from './metadata';