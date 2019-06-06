import {noop} from '@ng/common';

import {DynamicModule, NgModuleFactoryPromise} from "../../../../../ngDynamic-core";
import {TextBlockDesignerModule} from './module';
import {TextBlockDesignerComponent} from './component';

declare var isAot: boolean;

const moduleFactory: Promise<NgModuleFactoryPromise> = import(`./module/index${isAot ? '.aot' : ''}`).catch(noop);

export const placeholderModule: DynamicModule =
{
    component: TextBlockDesignerComponent,
    module: TextBlockDesignerModule,
    moduleFactory: moduleFactory
};

export * from './metadata';